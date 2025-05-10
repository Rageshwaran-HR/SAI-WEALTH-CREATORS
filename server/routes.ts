import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertContactSchema } from "@shared/schema";
import financeRoutes from "./routes/financeRoutes";
import consultationRoutes from "./routes/consultationRoutes";

export async function registerRoutes(app: Express): Promise<Server> {
  // API prefix for all routes
  const apiPrefix = "/api";
  
  // Register finance routes
  app.use(`${apiPrefix}/finance`, financeRoutes);
  
  // Register consultation routes
  app.use(`${apiPrefix}/consultation`, consultationRoutes);
  
  // GET services
  app.get(`${apiPrefix}/services`, async (req, res) => {
    try {
      const services = await storage.getAllServices();
      return res.status(200).json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      return res.status(500).json({ message: "Failed to retrieve services" });
    }
  });

  // GET service by slug
  app.get(`${apiPrefix}/services/:slug`, async (req, res) => {
    try {
      const { slug } = req.params;
      const service = await storage.getServiceBySlug(slug);
      
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      return res.status(200).json(service);
    } catch (error) {
      console.error("Error fetching service:", error);
      return res.status(500).json({ message: "Failed to retrieve service" });
    }
  });

  // GET articles
  app.get(`${apiPrefix}/articles`, async (req, res) => {
    try {
      // Get query parameters for pagination & filtering
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const category = req.query.category as string || undefined;
      
      const articles = await storage.getArticles(page, limit, category);
      return res.status(200).json(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      return res.status(500).json({ message: "Failed to retrieve articles" });
    }
  });

  // GET article by slug
  app.get(`${apiPrefix}/articles/:slug`, async (req, res) => {
    try {
      const { slug } = req.params;
      const article = await storage.getArticleBySlug(slug);
      
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      return res.status(200).json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      return res.status(500).json({ message: "Failed to retrieve article" });
    }
  });

  // GET testimonials
  app.get(`${apiPrefix}/testimonials`, async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      return res.status(200).json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      return res.status(500).json({ message: "Failed to retrieve testimonials" });
    }
  });

  // GET FAQs
  app.get(`${apiPrefix}/faqs`, async (req, res) => {
    try {
      const category = req.query.category as string || undefined;
      const faqs = await storage.getFAQs(category);
      return res.status(200).json(faqs);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      return res.status(500).json({ message: "Failed to retrieve FAQs" });
    }
  });

  // POST contact form submission
  app.post(`${apiPrefix}/contact`, async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const submission = await storage.submitContactForm(contactData);
      
      return res.status(201).json({
        message: "Contact form submitted successfully",
        id: submission.id
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      
      console.error("Error submitting contact form:", error);
      return res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
