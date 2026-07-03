{
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {}
          ]
        }
      },
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1.3,
      "position": [
        624,
        -112
      ],
      "id": "fcfa43ef-0ddb-4797-b152-456266a3da1e",
      "name": "Schedule Trigger"
    },
    {
      "parameters": {
        "promptType": "define",
        "text": "Eres un asistente de taxi inteligente. Extrae el origen y destino de la siguiente solicitud:\n\n{{ $json.body.prompt }}\n\nRESPONDE SOLO CON UN OBJETO JSON EN ESTE FORMATO:\n{\n  \"origen\": \"[ciudad o dirección de origen]\",\n  \"destino\": \"[ciudad o dirección de destino]\"\n}\n\nNO agregues texto fuera del JSON.",
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 3.1,
      "position": [
        896,
        -80
      ],
      "id": "d83cc2c8-e147-4138-8a90-089737474e03",
      "name": "AI Agent (Parser)"
    },
    {
      "parameters": {
        "model": "llama-3.1-8b-instant",
        "options": {
          "temperature": 0.3
        }
      },
      "type": "@n8n/n8n-nodes-langchain.lmChatGroq",
      "typeVersion": 1,
      "position": [
        912,
        144
      ],
      "id": "01128c62-9889-4f5b-a846-e4b9f4ebe86b",
      "name": "Groq Chat Model",
      "credentials": {
        "groqApi": {
          "id": "TriQ7za07rolX3Ml",
          "name": "Groq account"
        }
      }
    },
    {
      "parameters": {
        "jsCode": "// Base de datos de conductores\nconst conductores = [\n  { id: 1, nombre: \"Carlos Pérez\", auto: \"Toyota Prius\", lat: 19.4326, lng: -99.1332, disponible: true },\n  { id: 2, nombre: \"María García\", auto: \"Nissan Versa\", lat: 19.4230, lng: -99.1270, disponible: true },\n  { id: 3, nombre: \"José Ramírez\", auto: \"Chevrolet Spark\", lat: 19.4400, lng: -99.1400, disponible: true },\n  { id: 4, nombre: \"Ana Martínez\", auto: \"Volkswagen Jetta\", lat: 19.4150, lng: -99.1500, disponible: true }\n];\n\n// Función para calcular distancia (Haversine)\nfunction calcularDistancia(lat1, lon1, lat2, lon2) {\n  const R = 6371;\n  const dLat = (lat2 - lat1) * Math.PI / 180;\n  const dLon = (lon2 - lon1) * Math.PI / 180;\n  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +\n          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *\n          Math.sin(dLon/2) * Math.sin(dLon/2);\n  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));\n  return R * c;\n}\n\n// Obtener origen del JSON parseado\nconst origen = $json.origen;\nconst destino = $json.destino;\n\n// Simular coordenadas del origen\nconst origenLat = 19.4326;\nconst origenLng = -99.1332;\n\n// Calcular distancia para cada conductor\nconst conductoresConDistancia = conductores\n  .filter(c => c.disponible)\n  .map(c => {\n    const distancia = calcularDistancia(origenLat, origenLng, c.lat, c.lng);\n    return { ...c, distancia: Math.round(distancia * 10) / 10 };\n  });\n\n// Ordenar por distancia (más cercano primero)\nconductoresConDistancia.sort((a, b) => a.distancia - b.distancia);\n\n// Seleccionar el más cercano\nconst mejorConductor = conductoresConDistancia[0];\n\n// Calcular tiempo estimado (velocidad promedio 30 km/h)\nconst velocidadPromedio = 30;\nconst tiempoEstimado = Math.round((mejorConductor.distancia / velocidadPromedio) * 60);\n\n// Devolver respuesta\nreturn {\n  conductor: mejorConductor.nombre,\n  auto: mejorConductor.auto,\n  distancia: mejorConductor.distancia,\n  tiempoEstimado: tiempoEstimado,\n  origen: origen,\n  destino: destino,\n  status: \"asignado\"\n};"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [
        1248,
        -80
      ],
      "id": "40b074f8-7abc-4c68-aa27-42d79efa024f",
      "name": "Buscador de Conductores"
    },
    {
      "parameters": {
        "sessionIdType": "customKey",
        "sessionKey": "taxi_session",
        "contextWindowLength": 10
      },
      "type": "@n8n/n8n-nodes-langchain.memoryBufferWindow",
      "typeVersion": 1.4,
      "position": [
        1040,
        144
      ],
      "id": "5a9c5533-faaa-48c8-9fcf-a9399c4316d0",
      "name": "Simple Memory"
    },
    {
      "parameters": {
        "fromEmail": "andrik.condeleal@cesunbc.edu.mx",
        "toEmail": "andrik.condeleal@cesunbc.edu.mx",
        "subject": "🚖 Viaje Asignado",
        "html": "<h1>🚖 Viaje Asignado</h1><p><strong>Conductor:</strong> {{ $json.conductor }}</p><p><strong>Auto:</strong> {{ $json.auto }}</p><p><strong>Distancia:</strong> {{ $json.distancia }} km</p><p><strong>Tiempo estimado:</strong> {{ $json.tiempoEstimado }} min</p><p><strong>Origen:</strong> {{ $json.origen }}</p><p><strong>Destino:</strong> {{ $json.destino }}</p>",
        "options": {}
      },
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 2.1,
      "position": [
        1472,
        -80
      ],
      "id": "cb258845-c252-40c3-93d3-c519eb47355c",
      "name": "Enviar Correo",
      "webhookId": "18fffbd8-1654-4e53-a364-ed53eec7ecfb",
      "credentials": {
        "smtp": {
          "id": "OL5R29MjtkyB30f5",
          "name": "SMTP account"
        }
      }
    }
  ],
  "connections": {
    "Schedule Trigger": {
      "main": [
        [
          {
            "node": "AI Agent (Parser)",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "AI Agent (Parser)": {
      "main": [
        [
          {
            "node": "Buscador de Conductores",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Groq Chat Model": {
      "ai_languageModel": [
        [
          {
            "node": "AI Agent (Parser)",
            "type": "ai_languageModel",
            "index": 0
          }
        ]
      ]
    },
    "Buscador de Conductores": {
      "main": [
        [
          {
            "node": "Enviar Correo",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Simple Memory": {
      "ai_memory": [
        [
          {
            "node": "AI Agent (Parser)",
            "type": "ai_memory",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {},
  "meta": {
    "instanceId": "82a7bd3164fcb04eebbc69e6134e5c8cd26f347de251cc62fae6d40f73261766"
  }
}
