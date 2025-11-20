import Stripe from 'stripe';

class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2023-10-16',
    });
  }

  async createPaymentIntent(
    amount: number,
    currency: string = 'usd',
    metadata?: Record<string, any>
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata,
      });

      return paymentIntent;
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  async retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error: any) {
      console.error('Error retrieving payment intent:', error);
      throw new Error('Payment intent not found');
    }
  }

  async confirmPaymentIntent(
    paymentIntentId: string,
    paymentMethodId?: string
  ): Promise<Stripe.PaymentIntent> {
    try {
      const updateData: any = {
        payment_method: paymentMethodId,
      };

      const paymentIntent = await this.stripe.paymentIntents.confirm(
        paymentIntentId,
        updateData
      );

      return paymentIntent;
    } catch (error: any) {
      console.error('Error confirming payment intent:', error);
      throw new Error('Failed to confirm payment');
    }
  }

  async cancelPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.cancel(paymentIntentId);
      return paymentIntent;
    } catch (error: any) {
      console.error('Error canceling payment intent:', error);
      throw new Error('Failed to cancel payment');
    }
  }

  async createRefund(
    paymentIntentId: string,
    amount?: number,
    reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'
  ): Promise<Stripe.Refund> {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
        reason,
      });

      return refund;
    } catch (error: any) {
      console.error('Error creating refund:', error);
      throw new Error('Failed to create refund');
    }
  }

  async createCustomer(
    email: string,
    name: string,
    metadata?: Record<string, any>
  ): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.create({
        email,
        name,
        metadata,
      });

      return customer;
    } catch (error: any) {
      console.error('Error creating customer:', error);
      throw new Error('Failed to create customer');
    }
  }

  async retrieveCustomer(customerId: string): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.retrieve(customerId);
      return customer as Stripe.Customer;
    } catch (error: any) {
      console.error('Error retrieving customer:', error);
      throw new Error('Customer not found');
    }
  }

  async createSetupIntent(customerId: string): Promise<Stripe.SetupIntent> {
    try {
      const setupIntent = await this.stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: ['card'],
      });

      return setupIntent;
    } catch (error: any) {
      console.error('Error creating setup intent:', error);
      throw new Error('Failed to create setup intent');
    }
  }

  async listPaymentMethods(customerId: string): Promise<Stripe.ApiList<Stripe.PaymentMethod>> {
    try {
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });

      return paymentMethods;
    } catch (error: any) {
      console.error('Error listing payment methods:', error);
      throw new Error('Failed to list payment methods');
    }
  }

  async constructEvent(
    payload: string | Buffer,
    signature: string,
    webhookSecret: string
  ): Promise<Stripe.Event> {
    try {
      const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
      return event;
    } catch (error: any) {
      console.error('Error constructing webhook event:', error);
      throw new Error('Invalid webhook signature');
    }
  }

  // Helper method to format amount for display
  formatAmount(amount: number, currency: string = 'usd'): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    });

    return formatter.format(amount);
  }

  // Helper method to get payment status
  getPaymentStatus(status: Stripe.PaymentIntent.Status): string {
    const statusMap: Record<Stripe.PaymentIntent.Status, string> = {
      canceled: 'Cancelled',
      processing: 'Processing',
      requires_action: 'Requires Action',
      requires_capture: 'Requires Capture',
      requires_confirmation: 'Requires Confirmation',
      requires_payment_method: 'Requires Payment Method',
      succeeded: 'Succeeded',
    };

    return statusMap[status] || 'Unknown';
  }
}

export const stripeService = new StripeService();