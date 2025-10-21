import { GoogleGenAI, Type } from "@google/genai";
import type { ScheduleData } from '../types';

// The API key must be obtained exclusively from the environment variable `process.env.API_KEY`.
const ai = new GoogleGenAI({apiKey: process.env.API_KEY!});

const scheduleSchema = {
  type: Type.OBJECT,
  properties: {
    professionals: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          specialty: { type: Type.STRING },
        },
        required: ['id', 'name', 'specialty'],
      },
    },
    patients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
        },
        required: ['id', 'name'],
      },
    },
    appointments: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          professionalId: { type: Type.STRING },
          patientId: { type: Type.STRING },
          patientName: { type: Type.STRING },
          start: { type: Type.STRING, description: 'Date and time as a timestamp string or in ISO 8601 format.'},
          end: { type: Type.STRING, description: 'Date and time as a timestamp string or in ISO 8601 format.'},
          status: { type: Type.STRING, enum: ['agendado', 'confirmado', 'concluido', 'cancelado'] },
          price: { type: Type.NUMBER },
          notes: { type: Type.STRING },
        },
        required: ['id', 'professionalId', 'patientId', 'patientName', 'start', 'end', 'status', 'price'],
      },
    },
  },
  required: ['professionals', 'patients', 'appointments'],
};


export async function manageScheduleWithAI(
  prompt: string,
  scheduleData: ScheduleData
): Promise<ScheduleData | null> {
  // Use gemini-2.5-flash for complex text tasks as per guidelines.
  const model = 'gemini-2.5-flash';

  const fullPrompt = `
    Você é um assistente de IA para gerenciar a agenda de uma clínica.
    Sua tarefa é analisar o pedido do usuário e o estado atual da agenda, e então retornar o OBJETO JSON COMPLETO da agenda atualizada.
    
    Observações importantes:
    - SEMPRE retorne o objeto JSON completo da agenda, incluindo profissionais, pacientes e consultas.
    - Se precisar criar uma nova consulta ou paciente, gere um novo 'id' único (ex: 'appt_new_1', 'pat_new_1').
    - Se um paciente novo for agendado (ex: 'Juliana Paes'), adicione-o à lista de pacientes. Use o nome fornecido no prompt para o 'patientName' da consulta.
    - Datas e horas devem ser representadas como strings de timestamp (milissegundos desde a época). A data atual é ${new Date().toISOString()}.
    - O status de uma nova consulta deve ser 'agendado'.
    - Se o usuário pedir para editar um profissional (ex: "Altere a especialidade do Dr. João para Ortopedia"), modifique o objeto do profissional correspondente.
    - Se o usuário pedir para alterar o status de uma consulta (ex: "Marque a consulta de Mariana Costa como concluída"), encontre a consulta e atualize o campo 'status'.
    - Não inclua nenhuma explicação, apenas o objeto JSON.

    Estado atual da agenda:
    ${JSON.stringify(scheduleData, null, 2)}

    Pedido do usuário:
    "${prompt}"

    Retorne o JSON da agenda atualizada:
    `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: fullPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: scheduleSchema,
      }
    });

    const text = response.text;
    if (text) {
        // The Gemini API with responseSchema and application/json mime type should return a valid JSON string.
        const cleanedJsonString = text.trim();
        const result = JSON.parse(cleanedJsonString);
        return result as ScheduleData;
    }
    console.error('Gemini API returned empty response.');
    return null;

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return null;
  }
}
