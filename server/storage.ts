import { db } from "@db";
import { eq, and, desc, like, sql, asc } from "drizzle-orm";
import * as schema from "@shared/schema";
import { type InsertContact } from "@shared/schema";

export const storage = {
  // Services
  
  getAllServices: async () => {
    try {
      const services = await db.query.services.findMany({
        orderBy: [desc(schema.services.featured), asc(schema.services.title)]
      });
      return services;
    } catch (error) {
      console.error("Database error in getAllServices:", error);
      throw error;
    }
  },
  
  getServiceBySlug: async (slug: string) => {
    try {
      const service = await db.query.services.findFirst({
        where: eq(schema.services.slug, slug)
      });
      return service;
    } catch (error) {
      console.error(`Database error in getServiceBySlug (${slug}):`, error);
      throw error;
    }
  },

  // Articles
  
  getArticles: async (page: number = 1, limit: number = 10, category?: string) => {
    try {
      const offset = (page - 1) * limit;
      
      let query = db.select().from(schema.articles);
      
      // Apply category filter if provided
      if (category && category !== 'All Categories') {
        query = query.where(eq(schema.articles.category, category));
      }
      
      const articles = await query
        .orderBy(desc(schema.articles.publishedAt))
        .limit(limit)
        .offset(offset);
      
      // Get total count for pagination
      const countQuery = db.select({ count: sql<number>`count(*)` }).from(schema.articles);
      
      // Apply same filter to count query
      if (category && category !== 'All Categories') {
        countQuery.where(eq(schema.articles.category, category));
      }
      
      const [{ count }] = await countQuery;
      
      return {
        data: articles,
        pagination: {
          page,
          limit,
          totalItems: count,
          totalPages: Math.ceil(count / limit)
        }
      };
    } catch (error) {
      console.error("Database error in getArticles:", error);
      throw error;
    }
  },
  
  getArticleBySlug: async (slug: string) => {
    try {
      const article = await db.query.articles.findFirst({
        where: eq(schema.articles.slug, slug)
      });
      return article;
    } catch (error) {
      console.error(`Database error in getArticleBySlug (${slug}):`, error);
      throw error;
    }
  },

  // Testimonials
  
  getTestimonials: async (featuredOnly: boolean = false) => {
    try {
      let query = db.select().from(schema.testimonials);
      
      if (featuredOnly) {
        query = query.where(eq(schema.testimonials.featured, true));
      }
      
      const testimonials = await query.orderBy(desc(schema.testimonials.createdAt));
      return testimonials;
    } catch (error) {
      console.error("Database error in getTestimonials:", error);
      throw error;
    }
  },

  // FAQs
  
  getFAQs: async (category?: string) => {
    try {
      let query = db.select().from(schema.faqs);
      
      if (category) {
        query = query.where(eq(schema.faqs.category, category));
      }
      
      const faqs = await query.orderBy(asc(schema.faqs.sortOrder));
      return faqs;
    } catch (error) {
      console.error("Database error in getFAQs:", error);
      throw error;
    }
  },

  // Contact Form
  
  submitContactForm: async (contactData: InsertContact) => {
    try {
      const [submission] = await db.insert(schema.contactSubmissions)
        .values(contactData)
        .returning({ id: schema.contactSubmissions.id });
        
      return submission;
    } catch (error) {
      console.error("Database error in submitContactForm:", error);
      throw error;
    }
  },
  
  getContactSubmissions: async (page: number = 1, limit: number = 10, status?: string) => {
    try {
      const offset = (page - 1) * limit;
      
      let query = db.select().from(schema.contactSubmissions);
      
      // Apply status filter if provided
      if (status) {
        query = query.where(eq(schema.contactSubmissions.status, status));
      }
      
      const submissions = await query
        .orderBy(desc(schema.contactSubmissions.createdAt))
        .limit(limit)
        .offset(offset);
      
      // Get total count for pagination
      const countQuery = db.select({ count: sql<number>`count(*)` }).from(schema.contactSubmissions);
      
      // Apply same filter to count query
      if (status) {
        countQuery.where(eq(schema.contactSubmissions.status, status));
      }
      
      const [{ count }] = await countQuery;
      
      return {
        data: submissions,
        pagination: {
          page,
          limit,
          totalItems: count,
          totalPages: Math.ceil(count / limit)
        }
      };
    } catch (error) {
      console.error("Database error in getContactSubmissions:", error);
      throw error;
    }
  },
  
  updateContactSubmission: async (id: number, status: string) => {
    try {
      const [updatedSubmission] = await db.update(schema.contactSubmissions)
        .set({ 
          status, 
          updatedAt: new Date() 
        })
        .where(eq(schema.contactSubmissions.id, id))
        .returning();
        
      return updatedSubmission;
    } catch (error) {
      console.error(`Database error in updateContactSubmission (${id}):`, error);
      throw error;
    }
  }
};
