import { ApiDelivery } from '../../data/sources/remote/api/ApiDelivery';
import { ChatMessage, ProjectStructure } from '../../domain/entities/ChatMessage';
import { Project } from '../../domain/entities/Project';
import { Task } from '../../domain/entities/Task';

export const ChatbotRepository = {
  async sendMessage(
    message: string,
    session_id?: number
  ): Promise<{ session_id: number; reply: string }> {
    const { data } = await ApiDelivery.post('/chatbot/message', { message, session_id });
    return data.data;
  },

  async history(session_id: number): Promise<ChatMessage[]> {
    const { data } = await ApiDelivery.get('/chatbot/history', { params: { session_id } });
    return data?.data?.messages || [];
  },

  async sessions(): Promise<Array<{ id: number; title: string; created_at: string }>> {
    const { data } = await ApiDelivery.get('/chatbot/sessions');
    return data?.data?.sessions || [];
  },

  /**
   * Si createInDb=true, el backend crea el proyecto + tareas en MySQL y devuelve los IDs reales.
   * Si createInDb=false, solo devuelve la propuesta (útil para previsualizar antes de confirmar).
   */
  async generateProject(
    prompt: string,
    createInDb = false
  ): Promise<{ created: boolean; structure: ProjectStructure; project?: Project; tasks?: Task[] }> {
    const { data } = await ApiDelivery.post('/chatbot/generate-project', { prompt, createInDb });
    return data.data;
  },
};