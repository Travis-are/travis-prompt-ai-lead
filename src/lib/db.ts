import { prisma } from "./prisma";

const memoryStore: {
  leads: any[];
  conversations: any[];
  messages: any[];
  followups: any[];
  appointments: any[];
  analytics: any[];
  config: any;
  products: any[];
} = {
  leads: [],
  conversations: [],
  messages: [],
  followups: [],
  appointments: [],
  analytics: [],
  config: null,
  products: [],
};

const hasDatabase = !!process.env.DATABASE_URL;

function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

export const db = {
  getConfig: async () => {
    if (hasDatabase) {
      return prisma.businessConfig.findFirst({ include: { products: true } });
    }
    return memoryStore.config;
  },

  createConfig: async (data: any) => {
    if (hasDatabase) return prisma.businessConfig.create({ data });
    memoryStore.config = { ...data, id: generateId(), createdAt: new Date(), updatedAt: new Date() };
    return memoryStore.config;
  },

  updateConfig: async (id: string, data: any) => {
    if (hasDatabase) return prisma.businessConfig.update({ where: { id }, data });
    memoryStore.config = { ...memoryStore.config, ...data, updatedAt: new Date() };
    return memoryStore.config;
  },

  createProduct: async (data: any) => {
    if (hasDatabase) return prisma.productService.create({ data });
    const product = { ...data, id: generateId(), createdAt: new Date() };
    memoryStore.products.push(product);
    return product;
  },

  getProducts: async (configId?: string) => {
    if (hasDatabase) {
      return prisma.productService.findMany({ where: configId ? { configId } : undefined });
    }
    return memoryStore.products;
  },

  getLeads: async () => {
    if (hasDatabase) {
      return prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
        include: { conversations: true, appointments: true, followUps: true },
      });
    }
    return memoryStore.leads;
  },

  getLeadById: async (id: string) => {
    if (hasDatabase) {
      return prisma.lead.findUnique({ where: { id }, include: { conversations: true, appointments: true, followUps: true } });
    }
    return memoryStore.leads.find((l) => l.id === id) || null;
  },

  createLead: async (data: any) => {
    if (hasDatabase) return prisma.lead.create({ data });
    const lead = { ...data, id: generateId(), createdAt: new Date(), updatedAt: new Date(), conversations: [], appointments: [], followUps: [] };
    memoryStore.leads.push(lead);
    return lead;
  },

  updateLead: async (id: string, data: any) => {
    if (hasDatabase) return prisma.lead.update({ where: { id }, data });
    const idx = memoryStore.leads.findIndex((l) => l.id === id);
    if (idx >= 0) {
      memoryStore.leads[idx] = { ...memoryStore.leads[idx], ...data, updatedAt: new Date() };
      return memoryStore.leads[idx];
    }
    return null;
  },

  getConversations: async () => {
    if (hasDatabase) {
      return prisma.conversation.findMany({ orderBy: { createdAt: "desc" }, include: { messages: true, lead: true } });
    }
    return memoryStore.conversations.map((c) => ({
      ...c,
      messages: memoryStore.messages.filter((m) => m.conversationId === c.id),
    }));
  },

  getConversationById: async (id: string) => {
    if (hasDatabase) {
      return prisma.conversation.findUnique({ where: { id }, include: { messages: true, lead: true } });
    }
    const conv = memoryStore.conversations.find((c) => c.id === id);
    if (!conv) return null;
    return { ...conv, messages: memoryStore.messages.filter((m) => m.conversationId === id) };
  },

  createConversation: async (data: any) => {
    if (hasDatabase) return prisma.conversation.create({ data });
    const conv = { ...data, id: generateId(), createdAt: new Date(), updatedAt: new Date(), messages: [] };
    memoryStore.conversations.push(conv);
    return conv;
  },

  updateConversation: async (id: string, data: any) => {
    if (hasDatabase) return prisma.conversation.update({ where: { id }, data });
    const idx = memoryStore.conversations.findIndex((c) => c.id === id);
    if (idx >= 0) {
      memoryStore.conversations[idx] = { ...memoryStore.conversations[idx], ...data, updatedAt: new Date() };
      return memoryStore.conversations[idx];
    }
    return null;
  },

  createMessage: async (data: any) => {
    if (hasDatabase) return prisma.message.create({ data });
    const msg = { ...data, id: generateId(), createdAt: new Date() };
    memoryStore.messages.push(msg);
    return msg;
  },

  getFollowUps: async () => {
    if (hasDatabase) return prisma.followUp.findMany({ orderBy: { createdAt: "desc" }, include: { lead: true } });
    return memoryStore.followups;
  },

  createFollowUp: async (data: any) => {
    if (hasDatabase) return prisma.followUp.create({ data });
    const fu = { ...data, id: generateId(), createdAt: new Date() };
    memoryStore.followups.push(fu);
    return fu;
  },

  updateFollowUp: async (id: string, data: any) => {
    if (hasDatabase) return prisma.followUp.update({ where: { id }, data });
    const idx = memoryStore.followups.findIndex((f) => f.id === id);
    if (idx >= 0) {
      memoryStore.followups[idx] = { ...memoryStore.followups[idx], ...data };
      return memoryStore.followups[idx];
    }
    return null;
  },

  getAppointments: async () => {
    if (hasDatabase) return prisma.appointment.findMany({ orderBy: { createdAt: "desc" }, include: { lead: true } });
    return memoryStore.appointments;
  },

  createAppointment: async (data: any) => {
    if (hasDatabase) return prisma.appointment.create({ data });
    const appt = { ...data, id: generateId(), createdAt: new Date() };
    memoryStore.appointments.push(appt);
    return appt;
  },

  updateAppointment: async (id: string, data: any) => {
    if (hasDatabase) return prisma.appointment.update({ where: { id }, data });
    const idx = memoryStore.appointments.findIndex((a) => a.id === id);
    if (idx >= 0) {
      memoryStore.appointments[idx] = { ...memoryStore.appointments[idx], ...data };
      return memoryStore.appointments[idx];
    }
    return null;
  },

  getAnalytics: async () => {
    if (hasDatabase) return prisma.analytics.findFirst({ orderBy: { date: "desc" } });
    return memoryStore.analytics[memoryStore.analytics.length - 1] || {
      totalInquiries: 0, responseTime: 0, inquiriesAnswered: 0,
      qualifiedLeads: 0, appointmentRequests: 0, appointmentsBooked: 0,
      followUpCompletion: 0, humanHandoffRate: 0, unresolvedCount: 0,
    };
  },

  updateAnalytics: async (data: any) => {
    if (hasDatabase) {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const existing = await prisma.analytics.findUnique({ where: { date: today } });
      if (existing) return prisma.analytics.update({ where: { date: today }, data: { ...data, date: today } });
      return prisma.analytics.create({ data: { ...data, date: today } });
    }
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const idx = memoryStore.analytics.findIndex((a) => new Date(a.date).toDateString() === today.toDateString());
    if (idx >= 0) {
      memoryStore.analytics[idx] = { ...memoryStore.analytics[idx], ...data };
      return memoryStore.analytics[idx];
    }
    const analytics = { id: generateId(), ...data, date: today };
    memoryStore.analytics.push(analytics);
    return analytics;
  },
};
