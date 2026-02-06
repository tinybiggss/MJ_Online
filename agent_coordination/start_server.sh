#!/bin/bash
# Start the Agent Coordination System server

echo "Starting MJ_Online Agent Coordination System..."
echo ""

# Check if NATS is running
if ! pgrep -x "nats-server" > /dev/null; then
    echo "NATS server is not running. Starting it now..."
    nats-server --jetstream --store_dir ~/nats-data > /dev/null 2>&1 &
    sleep 2
    echo "✓ NATS server started"
else
    echo "✓ NATS server already running"
fi

# Check if stream exists
if ! nats stream info MJ_ONLINE_WORK > /dev/null 2>&1; then
    echo "Stream MJ_ONLINE_WORK not found. Creating it now..."
    ./create_stream.sh
    echo ""
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Virtual environment not found. Running setup..."
    ./setup.sh
    echo ""
fi

# Activate virtual environment
source venv/bin/activate

# Start FastAPI server
echo ""
echo "Starting FastAPI server on http://localhost:8001"
echo "Web Dashboard: http://localhost:8001"
echo "API Docs: http://localhost:8001/docs"
echo "Health Check: http://localhost:8001/health"
echo ""
echo "Press Ctrl+C to stop"
echo ""

cd "$(dirname "$0")"
python server.py
