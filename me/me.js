
import mqtt from 'mqtt';

// Connect to HiveMQ (plain MQTT)
const mqttClient = mqtt.connect('mqtt://broker.hivemq.com:1883');
mqttClient.subscribe('esp3/sense');

// Connect to test.mosquitto.org WSS (MQTT over WebSocket)
const wssClient = mqtt.connect('wss://test.mosquitto.org:8081/mqtt');

wssClient.on('connect', () => {
  console.log('Connected to test.mosquitto.org over WSS');
});

// Relay messages
mqttClient.on('message', (topic, message) => {
  const payload = message.toString();

  // Validate JSON
  let jsonPayload;
  try {
    jsonPayload = JSON.parse(payload);
  } catch (err) {
    console.error('Invalid JSON from ESP32:', payload);
    return;
  }

  // Publish JSON over MQTT/WSS
  wssClient.publish('esp32/sense', JSON.stringify(jsonPayload));
  console.log('Relayed JSON to test.mosquitto.org:', jsonPayload);
});

