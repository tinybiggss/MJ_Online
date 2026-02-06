#!/bin/bash
# Setup script for Agent Coordination System

echo "Setting up Agent Coordination System for MJ_Online..."
echo ""

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo "✓ Virtual environment created"
else
    echo "✓ Virtual environment already exists"
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -q --upgrade pip
pip install -q -r requirements.txt
echo "✓ Dependencies installed"

echo ""
echo "Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Make sure NATS server is running"
echo "  2. Create the NATS stream: ./create_stream.sh"
echo "  3. Start the server: ./start_server.sh"
echo ""
