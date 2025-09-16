//@ts-nocheck
'use client'

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle } from 'lucide-react';

interface Flashcard {
  id: number;
  term: string;
  content: string;
  hasImage?: boolean;
  category?: string;
}

const flashcards: Flashcard[] = [
  {
    id: 1,
    term: "Dot Product",
    category: "Vectors",
    content: `$$\\vec{u} \\cdot \\vec{v} = u_1v_1 + u_2v_2 + u_3v_3 = ||\\vec{u}||||\\vec{v}||\\cos\\theta$$`
  },
  {
    id: 2,
    term: "Cosine of Angle",
    category: "Vectors",
    content: `$$\\cos\\theta = \\frac{\\vec{u} \\cdot \\vec{v}}{||\\vec{u}||||\\vec{v}||}$$`
  },
  {
    id: 3,
    term: "Vector Projection",
    category: "Vectors",
    content: `$$\\text{proj}_{\\vec{u}} \\vec{v} = \\frac{\\vec{u} \\cdot \\vec{v}}{||\\vec{u}||^2}\\vec{u}$$`
  },
  {
    id: 4,
    term: "Scalar Projection",
    category: "Vectors",
    content: `$$\\text{comp}_{\\vec{u}} \\vec{v} = \\frac{\\vec{u} \\cdot \\vec{v}}{||\\vec{u}||}$$`
  },
  {
    id: 5,
    term: "Work Done by Force",
    category: "Vectors",
    content: `$$W = \\vec{F} \\cdot \\overrightarrow{PQ} = ||\\vec{F}|| \\cdot ||\\overrightarrow{PQ}|| \\cos\\theta$$`
  },
  {
    id: 6,
    term: "Vector Magnitude",
    category: "Vectors",
    content: `$$||\\vec{v}|| = \\sqrt{x_1^2 + y_1^2 + z_1^2}$$`
  },
  {
    id: 7,
    term: "Unit Vector",
    category: "Vectors",
    content: `$$\\hat{v} = \\frac{\\vec{v}}{||\\vec{v}||} = \\frac{1}{||\\vec{v}||}(x_1, y_1, z_1), \\quad \\vec{v} \\neq \\vec{0}$$

Standard unit vectors: $\\hat{i} = (1,0,0)$, $\\hat{j} = (0,1,0)$, $\\hat{k} = (0,0,1)$`
  },
  {
    id: 8,
    term: "Distance Between Points",
    category: "Geometry",
    content: `$$d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2 + (z_2-z_1)^2}$$`
  },
  {
    id: 9,
    term: "Equation of Sphere",
    category: "Geometry",
    content: `$$(x-a)^2 + (y-b)^2 + (z-c)^2 = r^2$$

Center: $(a,b,c)$, Radius: $r$`
  },
  {
    id: 10,
    term: "Cross Product Area",
    category: "Vectors",
    content: `Area of parallelogram = $||\\vec{u} \\times \\vec{v}||$`
  },
  {
    id: 11,
    term: "Triple Scalar Product",
    category: "Vectors",
    content: `$$\\vec{u} \\cdot (\\vec{v} \\times \\vec{w})$$

Volume of parallelepiped = $|\\vec{u} \\cdot (\\vec{v} \\times \\vec{w})|$`
  },
  {
    id: 12,
    term: "Torque",
    category: "Vectors",
    content: `$$\\vec{\\tau} = \\vec{r} \\times \\vec{F}$$`
  },
  {
    id: 13,
    term: "Vector Equation of Line",
    category: "Lines & Planes",
    content: `$$\\vec{r} = \\vec{r_0} + t\\vec{v}$$

**Parametric form:**
$$x = x_0 + ta, \\quad y = y_0 + tb, \\quad z = z_0 + tc$$`
  },
  {
    id: 14,
    term: "Symmetric Equations of Line",
    category: "Lines & Planes",
    content: `$$\\frac{x-x_0}{a} = \\frac{y-y_0}{b} = \\frac{z-z_0}{c}$$`
  },
  {
    id: 15,
    term: "Distance Point to Line",
    category: "Lines & Planes",
    content: `$$d = \\frac{||\\overrightarrow{PQ} \\times \\vec{v}||}{||\\vec{v}||}$$

Where $P$ is on the line, $Q$ is the external point, $\\vec{v}$ is direction vector.`
  },
  {
    id: 16,
    term: "Vector Equation of Plane",
    category: "Lines & Planes",
    content: `$$\\vec{n} \\cdot \\overrightarrow{PQ} = 0$$`
  },
  {
    id: 17,
    term: "Scalar Equation of Plane",
    category: "Lines & Planes",
    content: `$$a(x-x_0) + b(y-y_0) + c(z-z_0) = 0$$

**General form:** $ax + by + cz + d = 0$`
  },
  {
    id: 18,
    term: "Distance Point to Plane",
    category: "Lines & Planes",
    content: `$$d = \\frac{|ax_0 + by_0 + cz_0 + d|}{\\sqrt{a^2 + b^2 + c^2}}$$

For plane $ax + by + cz + d = 0$ and point $(x_0, y_0, z_0)$.`
  },
  {
    id: 19,
    term: "Angle Between Planes",
    category: "Lines & Planes",
    content: `$$\\cos\\theta = \\frac{|\\vec{n_1} \\cdot \\vec{n_2}|}{||\\vec{n_1}|| \\cdot ||\\vec{n_2}||}$$

Where $\\vec{n_1}$, $\\vec{n_2}$ are normal vectors to the planes.`
  },
  {
    id: 20,
    term: "Elliptic Cone",
    category: "Quadric Surfaces",
    hasImage: true,
    content: `$$\\frac{x^2}{a^2} + \\frac{y^2}{b^2} - \\frac{z^2}{c^2} = 0$$

**Traces:**
- $z = p$: Ellipse
- $y = q$, $x = r$: Hyperbola

*[IMAGE PLACEHOLDER: Elliptic cone visualization]*`
  },
  {
    id: 21,
    term: "Elliptic Paraboloid",
    category: "Quadric Surfaces",
    hasImage: true,
    content: `$$z = \\frac{x^2}{a^2} + \\frac{y^2}{b^2}$$

**Traces:**
- $z = p > 0$: Ellipse
- $y = q$, $x = r$: Parabola

*[IMAGE PLACEHOLDER: Elliptic paraboloid visualization]*`
  },
  {
    id: 22,
    term: "Hyperbolic Paraboloid",
    category: "Quadric Surfaces",
    hasImage: true,
    content: `$$z = \\frac{x^2}{a^2} - \\frac{y^2}{b^2}$$

**Traces:**
- $z = p \\neq 0$: Hyperbola
- $y = q$, $x = r$: Parabola

Saddle-shaped surface.

*[IMAGE PLACEHOLDER: Hyperbolic paraboloid visualization]*`
  }
];

const FlashcardApp: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cards, setCards] = useState<Flashcard[]>(flashcards);

  const currentCard = cards[currentIndex];

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
    setIsFlipped(false);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    setIsFlipped(false);
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          prevCard();
          break;
        case 'ArrowRight':
          event.preventDefault();
          nextCard();
          break;
        case ' ':
        case 'Enter':
          event.preventDefault();
          flipCard();
          break;
        case 's':
        case 'S':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            shuffleCards();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
        integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
        crossOrigin="anonymous"
      />
      
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-medium text-gray-100 mb-4">
              Mathematics
            </h1>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
              <span className="bg-gray-800 border border-gray-700 px-3 py-1 rounded-lg">
                {currentIndex + 1} / {cards.length}
              </span>
              {currentCard.category && (
                <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-lg">
                  {currentCard.category}
                </span>
              )}
            </div>
          </div>

          {/* Card Container */}
          <div className="relative perspective-1000 mb-8">
            <div
              className={`relative w-full h-[500px] transition-transform duration-500 ease-out transform-gpu ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              {/* Front */}
              <div
                className="absolute inset-0 w-full h-full bg-gray-900 border border-gray-800 rounded-2xl p-8 flex items-center justify-center cursor-pointer hover:bg-gray-800/50 transition-colors duration-200"
                onClick={flipCard}
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="text-center">
                  <h2 className="text-3xl font-medium text-gray-100 mb-4">
                    {currentCard.term}
                  </h2>
                  <p className="text-gray-500 text-sm">Click to reveal</p>
                </div>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 w-full h-full bg-gray-900 border border-gray-800 rounded-2xl p-8 overflow-y-auto cursor-pointer hover:bg-gray-800/50 transition-colors duration-200"
                onClick={flipCard}
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-xl font-medium text-gray-100 mb-3" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-lg font-medium text-gray-200 mb-2" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-base font-medium text-gray-300 mb-2" {...props} />,
                      p: ({node, ...props}) => <p className="mb-3 text-gray-300 leading-relaxed" {...props} />,
                      strong: ({node, ...props}) => <strong className="text-gray-200 font-medium" {...props} />,
                      em: ({node, ...props}) => <em className="text-blue-400" {...props} />,
                      ul: ({node, ...props}) => <ul className="mb-3 space-y-1" {...props} />,
                      li: ({node, ...props}) => <li className="text-gray-300" {...props} />,
                      code: ({node, inline, ...props}) => 
                        inline 
                          ? <code className="bg-gray-800 border border-gray-700 px-2 py-1 rounded text-sm text-blue-400" {...props} />
                          : <code className="block bg-gray-800 border border-gray-700 p-4 rounded-lg overflow-x-auto text-sm" {...props} />
                    }}
                  >
                    {currentCard.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={prevCard}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700 transition-colors duration-200 text-gray-300"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={shuffleCards}
                className="p-2 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700 transition-colors duration-200 text-gray-300"
                title="Shuffle"
              >
                <Shuffle size={18} />
              </button>

              <button
                onClick={flipCard}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 border border-blue-500 rounded-xl hover:bg-blue-700 transition-colors duration-200 text-white"
              >
                <RotateCcw size={18} />
                Flip
              </button>
            </div>

            <button
              onClick={nextCard}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700 transition-colors duration-200 text-gray-300"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-1 mb-6">
            {cards.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsFlipped(false);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-blue-500 scale-125'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Keyboard Shortcuts */}
          <div className="text-center text-xs text-gray-500">
            <div className="flex justify-center gap-4">
              <span>← → Navigate</span>
              <span>Space/Enter Flip</span>
              <span>Ctrl+S Shuffle</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 { perspective: 1000px; }
        .rotate-y-180 { transform: rotateY(180deg); }
        
        .katex-display {
          margin: 1rem 0 !important;
          text-align: center;
        }
        
        .katex { font-size: 1em; }
        
        @media (max-width: 640px) {
          .katex { font-size: 0.9em; }
          .katex-display { overflow-x: auto; }
        }
      `}</style>
    </>
  );
};

export default FlashcardApp;