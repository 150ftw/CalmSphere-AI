import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getModules } from '../api';
import { Button } from '../components/ui/button';
import { ArrowLeft, Wind, Anchor, Brain, BookOpen, Moon } from 'lucide-react';

const MODULE_ICONS = {
  breathing: Wind,
  grounding: Anchor,
  cbt: Brain,
  journaling: BookOpen,
  sleep: Moon
};

export default function Modules() {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    try {
      const response = await getModules();
      setModules(response.data);
    } catch (error) {
      console.error('Failed to load modules', error);
    }
  };

  if (selectedModule) {
    const Icon = MODULE_ICONS[selectedModule.module_type] || Brain;

    return (
      <div className="min-h-screen bg-background bg-noise">
        <header className="border-b border-border/40 bg-card/50 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <Button
              data-testid="back-to-modules-btn"
              onClick={() => setSelectedModule(null)}
              variant="ghost"
              className="hover:bg-muted/50 rounded-full"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Modules
            </Button>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-6 py-16">
          <div className="bg-card rounded-2xl shadow-float p-8 md:p-12 border border-border/40">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="font-fraunces text-3xl font-medium">{selectedModule.title}</h1>
                <p className="text-muted-foreground">{selectedModule.description}</p>
              </div>
            </div>

            <div className="mb-6">
              <span className="px-3 py-1 bg-muted/50 rounded-full text-sm">
                {selectedModule.difficulty}
              </span>
              <span className="ml-2 text-sm text-muted-foreground">
                {selectedModule.content.duration}
              </span>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-lg">Steps:</h3>
              <ol className="space-y-3">
                {selectedModule.content.steps.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="leading-relaxed pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-noise">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4">
          <Button
            data-testid="back-btn"
            onClick={() => navigate('/dashboard')}
            variant="ghost"
            className="hover:bg-muted/50 rounded-full"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <h1 className="font-fraunces text-4xl md:text-5xl font-normal mb-4">Self-Help Resources</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Explore evidence-based techniques to support your mental wellness
        </p>

        <div data-testid="modules-list" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const Icon = MODULE_ICONS[module.module_type] || Brain;
            return (
              <button
                key={module.id}
                data-testid={`module-${module.id}`}
                onClick={() => setSelectedModule(module)}
                className="bg-card rounded-2xl p-6 border border-border/40 shadow-soft hover:shadow-float hover:-translate-y-1 transition-all text-left group"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-fraunces text-xl font-medium mb-2">{module.title}</h3>
                <p className="text-muted-foreground text-sm mb-3">{module.description}</p>
                <div className="flex flex-wrap gap-2">
                  {module.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className="px-2 py-1 bg-muted/50 rounded text-xs">{tag}</span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}