#!/bin/bash
# Create NATS JetStream stream for MJ_Online coordination

echo "Creating MJ_ONLINE_WORK stream..."
echo ""

# Check if NATS CLI is installed
if ! command -v nats &> /dev/null; then
    echo "Error: NATS CLI is not installed."
    echo "Install with: brew install nats-io/nats-tools/nats"
    exit 1
fi

# Check if NATS server is running
if ! pgrep -x "nats-server" > /dev/null; then
    echo "NATS server is not running. Starting it now..."
    nats-server --jetstream --store_dir ~/nats-data > /dev/null 2>&1 &
    sleep 2
    echo "✓ NATS server started"
else
    echo "✓ NATS server already running"
fi

# Check if stream already exists
if nats stream info MJ_ONLINE_WORK > /dev/null 2>&1; then
    echo "✓ Stream MJ_ONLINE_WORK already exists"
    echo ""
    echo "Stream info:"
    nats stream info MJ_ONLINE_WORK
else
    echo "Creating stream MJ_ONLINE_WORK..."
    nats stream add MJ_ONLINE_WORK \
        --subjects "mjwork.>" \
        --storage file \
        --retention limits \
        --max-age=168h \
        --defaults > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        echo "✓ Stream created successfully"
        echo ""
        echo "Stream info:"
        nats stream info MJ_ONLINE_WORK
    else
        echo "✗ Failed to create stream"
        exit 1
    fi
fi

echo ""
echo "Stream setup complete!"
echo ""
echo "Subjects:"
echo "  - mjwork.tasks.available    (Available tasks queue)"
echo "  - mjwork.tasks.claimed      (Tasks being worked on)"
echo "  - mjwork.tasks.completed    (Completed tasks)"
echo "  - mjwork.tasks.failed       (Failed tasks)"
echo "  - mjwork.coordination       (Agent coordination messages)"
echo "  - mjwork.errors             (Error messages)"
echo "  - mjwork.status             (Agent status/heartbeats)"
echo ""
echo "Ready to start the server!"
echo ""
