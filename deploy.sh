#!/bin/bash

# Tele-Psychiatry System Deployment Script
# This script helps deploy the entire system using Docker Compose

set -e

echo "🚀 Starting Tele-Psychiatry System Deployment"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi

    print_success "Docker and Docker Compose are installed"
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."

    mkdir -p backend/uploads
    mkdir -p docker/mongo-init

    print_success "Directories created"
}

# Build and start services
deploy_services() {
    print_status "Building and starting services..."

    # Stop any existing containers
    docker-compose down || true

    # Build and start all services
    docker-compose up -d --build

    print_success "Services deployed successfully"
}

# Wait for services to be healthy
wait_for_services() {
    print_status "Waiting for services to be healthy..."

    # Wait for backend to be healthy
    max_attempts=30
    attempt=1

    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:5000/api/health &>/dev/null; then
            print_success "Backend service is healthy"
            break
        fi

        print_status "Waiting for backend service... (attempt $attempt/$max_attempts)"
        sleep 10
        ((attempt++))
    done

    if [ $attempt -gt $max_attempts ]; then
        print_error "Backend service failed to become healthy"
        exit 1
    fi
}

# Show deployment status
show_status() {
    print_status "Deployment Status:"
    echo ""

    docker-compose ps

    echo ""
    print_success "Services are running!"
    echo ""
    echo "🌐 Admin Portal: http://localhost:3000"
    echo "🔗 Backend API: http://localhost:5000"
    echo "📊 MongoDB: localhost:27017"
    echo "🔄 Redis: localhost:6379"
    echo ""
    echo "To view logs: docker-compose logs -f [service-name]"
    echo "To stop services: docker-compose down"
    echo "To restart services: docker-compose restart"
}

# Main deployment function
main() {
    echo "🏥 Tele-Psychiatry System Deployment"
    echo "===================================="
    echo ""

    check_docker
    create_directories
    deploy_services
    wait_for_services
    show_status

    print_success "Deployment completed successfully! 🎉"
}

# Handle command line arguments
case "${1:-}" in
    "stop")
        print_status "Stopping services..."
        docker-compose down
        print_success "Services stopped"
        ;;
    "restart")
        print_status "Restarting services..."
        docker-compose restart
        print_success "Services restarted"
        ;;
    "logs")
        docker-compose logs -f "${2:-}"
        ;;
    "status")
        show_status
        ;;
    "cleanup")
        print_warning "This will remove all containers, volumes, and images"
        read -p "Are you sure? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose down -v --rmi all
            print_success "Cleanup completed"
        fi
        ;;
    *)
        main
        ;;
esac