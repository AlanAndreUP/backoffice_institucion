'use client';

import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface MetricImage {
  id: string;
  url: string;
  title: string;
  description: string;
}

export default function MetricsPage() {
  const [selectedImage, setSelectedImage] = useState<MetricImage | null>(null);

  // Datos de las métricas disponibles en public/
  const metrics: MetricImage[] = [
    {
      id: 'asistencia',
      url: '/asistencia_forecasting.png',
      title: 'Pronóstico de Asistencia',
      description: 'Análisis predictivo de la asistencia de estudiantes'
    },
    {
      id: 'bullying',
      url: '/bullying_forecasting.png',
      title: 'Pronóstico de Bullying',
      description: 'Predicción de incidentes de bullying en el sistema'
    },
    {
      id: 'citas',
      url: '/citas_forecasting.png',
      title: 'Pronóstico de Citas',
      description: 'Análisis de tendencias en programación de citas'
    },
    {
      id: 'tareas',
      url: '/tareas_completadas_forecasting.png',
      title: 'Pronóstico de Tareas Completadas',
      description: 'Predicción de completitud de tareas académicas'
    }
  ];

  const openModal = (metric: MetricImage) => {
    setSelectedImage(metric);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Métricas del Sistema</h1>
            <p className="mt-1 text-sm text-gray-500">
              Visualiza análisis predictivos y métricas del sistema educativo
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {metrics.map((metric) => (
            <div 
              key={metric.id} 
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
              onClick={() => openModal(metric)}
            >
              <div className="relative">
                <img 
                  src={metric.url} 
                  alt={metric.title} 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <MagnifyingGlassIcon className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{metric.title}</h3>
                <p className="text-sm text-gray-600">{metric.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal para zoom */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={closeModal}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200 z-10"
              >
                <XMarkIcon className="h-8 w-8" />
              </button>
              <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
                <img 
                  src={selectedImage.url} 
                  alt={selectedImage.title} 
                  className="w-full h-auto max-h-[80vh] object-contain" 
                />
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedImage.title}</h2>
                  <p className="text-gray-600">{selectedImage.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
