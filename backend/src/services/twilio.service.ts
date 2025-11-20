import twilio from 'twilio';
import { v4 as uuidv4 } from 'uuid';

class TwilioService {
  private client: twilio.Twilio | null = null;
  private apiKey: string;
  private apiSecret: string;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    // Only initialize Twilio client if credentials are provided
    if (accountSid && authToken && accountSid !== 'your_twilio_account_sid' && authToken !== 'your_twilio_auth_token') {
      this.client = twilio(accountSid, authToken);
      console.log('✅ Twilio service initialized');
    } else {
      console.log('🧪 Twilio service not initialized - WebRTC video calls use Socket.IO signaling (built-in)');
    }

    this.apiKey = process.env.TWILIO_API_KEY || '';
    this.apiSecret = process.env.TWILIO_API_SECRET || '';
  }

  async createVideoRoom(roomName?: string): Promise<any> {
    try {
      if (!this.client) {
        throw new Error('Twilio client not configured');
      }

      const roomUniqueName = roomName || `tele-psychiatry-${uuidv4()}`;

      const room = await this.client.video.rooms.create({
        uniqueName: roomUniqueName,
        type: 'group',
        recordParticipantsOnConnect: false,
        maxParticipants: 2, // Doctor and patient only
      });

      return {
        roomId: room.sid,
        roomName: room.uniqueName,
        status: room.status,
      };
    } catch (error: any) {
      console.error('Error creating video room:', error);
      throw new Error('Failed to create video room');
    }
  }

  async getRoom(roomSid: string): Promise<any> {
    try {
      if (!this.client) {
        throw new Error('Twilio client not configured');
      }

      const room = await this.client.video.rooms(roomSid).fetch();
      // fetch participants to calculate count
      const participants = await this.client.video.rooms(roomSid).participants.list();
      return {
        roomId: room.sid,
        roomName: room.uniqueName,
        status: room.status,
        participantsCount: participants.length,
      };
    } catch (error: any) {
      console.error('Error fetching room:', error);
      throw new Error('Room not found');
    }
  }

  async completeRoom(roomSid: string): Promise<any> {
    try {
      const room = await this.client.video.rooms(roomSid).update({
        status: 'completed',
      });

      return {
        roomId: room.sid,
        status: room.status,
      };
    } catch (error: any) {
      console.error('Error completing room:', error);
      throw new Error('Failed to complete room');
    }
  }

  generateAccessToken(identity: string, roomName: string): string {
    try {
      if (!this.apiKey || !this.apiSecret || !process.env.TWILIO_ACCOUNT_SID) {
        throw new Error('Twilio API Key/Secret or Account SID not configured');
      }

      const token = new twilio.jwt.AccessToken(
        process.env.TWILIO_ACCOUNT_SID,
        this.apiKey,
        this.apiSecret,
        { identity }
      );

      // Add video grant
      const videoGrant = new twilio.jwt.AccessToken.VideoGrant({
        room: roomName,
      });

      token.addGrant(videoGrant);

      return token.toJwt();
    } catch (error: any) {
      console.error('Error generating access token:', error);
      throw new Error('Failed to generate access token');
    }
  }

  async getRoomParticipants(roomSid: string): Promise<any[]> {
    try {
      if (!this.client) return [];

      const participants = await this.client.video
        .rooms(roomSid)
        .participants.list();

      return participants.map(participant => ({
        participantId: participant.sid,
        identity: participant.identity,
        status: participant.status,
        startTime: participant.dateCreated,
        endTime: participant.dateUpdated,
      }));
    } catch (error: any) {
      console.error('Error fetching participants:', error);
      return [];
    }
  }

  async removeParticipant(roomSid: string, participantSid: string): Promise<any> {
    try {
      const participant = await this.client.video
        .rooms(roomSid)
        .participants(participantSid)
        .update({ status: 'disconnected' });

      return {
        participantId: participant.sid,
        status: participant.status,
      };
    } catch (error: any) {
      console.error('Error removing participant:', error);
      throw new Error('Failed to remove participant');
    }
  }
}

export const twilioService = new TwilioService();