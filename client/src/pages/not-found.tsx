import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <PageTransition>
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] px-4">
        <Card className="w-full max-w-md text-center shadow-xl">
          <CardContent className="pt-10 pb-8 px-6 relative">
            <div className="text-6xl animate-bounce mb-2">🤷‍♂️</div>
            <h1 className="text-3xl font-extrabold text-gray-800">Oops! 404</h1>
            <p className="text-sm text-gray-500 mt-2">Looks like you hit a dead end.</p>

            <div className="mt-6 text-gray-600 text-sm">
              <AlertTriangle className="inline-block text-yellow-500 mr-1" />
              This page ran away! Probably hiding in the router 🕵️‍♀️
            </div>

            <Link
              href="/"
              className="inline-block mt-8 px-6 py-2 rounded-full bg-primary text-white font-semibold hover:scale-105 transition-transform duration-300 shadow-lg"
            >
              🏠 Go Home
            </Link>

            <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 text-7xl opacity-20 pointer-events-none select-none">
              🛰️
            </div>
            <div className="absolute bottom-0 left-0 -translate-x-1/3 translate-y-1/3 text-6xl opacity-10 pointer-events-none select-none">
              🐾
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
