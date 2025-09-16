//@ts-nocheck
'use client'

import React, { useState, useEffect, useRef } from 'react';
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
    term: "Cosine of Angle Between Vectors",
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
    term: "Scalar Projection (Component)",
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
    content: `$$\\frac{\\vec{v}}{||\\vec{v}||} = \\frac{1}{||\\vec{v}||}(x_1, y_1, z_1) = \\left(\\frac{x_1}{||\\vec{v}||}, \\frac{y_1}{||\\vec{v}||}, \\frac{z_1}{||\\vec{v}||}\\right), \\quad \\vec{v} \\neq \\vec{0}$$

**Standard unit vectors:** $\\hat{i} = (1,0,0)$, $\\hat{j} = (0,1,0)$, $\\hat{k} = (0,0,1)$

**2D:** $\\vec{v} = \\langle x,y \\rangle = x\\hat{i} + y\\hat{j}$`
  },
  {
    id: 8,
    term: "Distance Between Two Points",
    category: "Geometry",
    content: `$$d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2 + (z_2-z_1)^2}$$`
  },
  {
    id: 9,
    term: "Sphere Equation",
    category: "Geometry",
    content: `$$(x-a)^2 + (y-b)^2 + (z-c)^2 = r^2$$

**Center:** $(a,b,c)$, **Radius:** $r$`
  },
  {
    id: 10,
    term: "Cross Product - Parallelogram Area",
    category: "Vectors",
    content: `If vectors $\\vec{u}$ and $\\vec{v}$ form adjacent sides of a parallelogram, then:

$$\\text{Area} = ||\\vec{u} \\times \\vec{v}||$$`
  },
  {
    id: 11,
    term: "Triple Scalar Product",
    category: "Vectors",
    content: `$$\\vec{u} \\cdot (\\vec{v} \\times \\vec{w})$$

**Volume of parallelepiped:** $V = |\\vec{u} \\cdot (\\vec{v} \\times \\vec{w})|$

If triple scalar product is zero, the vectors are **coplanar**.`
  },
  {
    id: 12,
    term: "Cross Product Properties",
    category: "Vectors",
    content: `The cross product can be used to identify a vector **orthogonal** to two given vectors or to a plane.

**Torque:** $\\vec{\\tau} = \\vec{r} \\times \\vec{F}$

Measures tendency of force to produce rotation about an axis.`
  },
  {
    id: 13,
    term: "Vector Equation of Line",
    category: "Lines & Planes",
    content: `$$\\vec{r} = \\vec{r_0} + t\\vec{v}$$

where $\\vec{r_0}$ is a point on the line and $\\vec{v}$ is the direction vector.`
  },
  {
    id: 14,
    term: "Parametric Equations of Line",
    category: "Lines & Planes",
    content: `$$x = x_0 + ta$$
$$y = y_0 + tb$$
$$z = z_0 + tc$$

where $(x_0, y_0, z_0)$ is a point on the line and $(a, b, c)$ is the direction vector.`
  },
  {
    id: 15,
    term: "Symmetric Equations of Line",
    category: "Lines & Planes",
    content: `$$\\frac{x-x_0}{a} = \\frac{y-y_0}{b} = \\frac{z-z_0}{c}$$`
  },
  {
    id: 16,
    term: "Distance from Point to Line",
    category: "Lines & Planes",
    content: `Let $L$ be a line passing through point $P$ with direction vector $\\vec{v}$. If $Q$ is any point not on $L$, then:

$$d = \\frac{||\\overrightarrow{PQ} \\times \\vec{v}||}{||\\vec{v}||}$$`
  },
  {
    id: 17,
    term: "Line Relationships in 3D",
    category: "Lines & Planes",
    content: `In three dimensions, two lines may be:
- **Parallel** but not equal
- **Equal** 
- **Intersecting**
- **Skew** (not parallel and don't intersect)`
  },
  {
    id: 18,
    term: "Vector Equation of Plane",
    category: "Lines & Planes",
    content: `$$\\vec{n} \\cdot \\overrightarrow{PQ} = 0$$

Given point $P$ and vector $\\vec{n}$, the set of all points $Q$ satisfying this equation forms a plane.`
  },
  {
    id: 19,
    term: "Scalar Equation of Plane",
    category: "Lines & Planes",
    content: `$$a(x-x_0) + b(y-y_0) + c(z-z_0) = 0$$

**General form:** $ax + by + cz + d = 0$

where $d = -ax_0 - by_0 - cz_0$ and $(x_0, y_0, z_0)$ is a point on the plane with normal vector $\\vec{n} = (a, b, c)$.`
  },
  {
    id: 20,
    term: "Distance from Point to Plane",
    category: "Lines & Planes",
    content: `Distance from point $(x_0, y_0, z_0)$ to plane $ax + by + cz + d = 0$:

$$D = \\frac{|ax_0 + by_0 + cz_0 + d|}{\\sqrt{a^2 + b^2 + c^2}}$$

**Vector form:** $D = ||\\text{proj}_{\\vec{n}} \\overrightarrow{QP}|| = |\\text{comp}_{\\vec{n}} \\overrightarrow{QP}| = \\frac{|\\overrightarrow{QP} \\cdot \\vec{n}|}{||\\vec{n}||}$`
  },
  {
    id: 21,
    term: "Angle Between Planes",
    category: "Lines & Planes",
    content: `$$\\cos\\theta = \\frac{|\\vec{n_1} \\cdot \\vec{n_2}|}{||\\vec{n_1}|| \\cdot ||\\vec{n_2}||}$$

where $\\vec{n_1}$ and $\\vec{n_2}$ are normal vectors to the planes.

**Note:** Normal vectors of parallel planes are parallel. When two planes intersect, they form a line.`
  },
  {
    id: 22,
    term: "Elliptic Cone",
    category: "Quadric Surfaces",
    hasImage: true,
    content: `$$\\frac{x^2}{a^2} + \\frac{y^2}{b^2} - \\frac{z^2}{c^2} = 0$$

**Traces:**
- In plane $z = p$: ellipse
- In plane $y = q$: hyperbola  
- In plane $x = r$: hyperbola
- In the $xz$-plane: pair of lines that intersect at origin
- In the $yz$-plane: pair of lines that intersect at origin

The axis corresponds to the variable with **negative coefficient**. Traces in coordinate planes parallel to the axis are intersecting lines.

*[IMAGE PLACEHOLDER: Elliptic cone visualization]*`
  },
  {
    id: 23,
    term: "Elliptic Paraboloid",
    category: "Quadric Surfaces", 
    hasImage: true,
    content: `$$z = \\frac{x^2}{a^2} + \\frac{y^2}{b^2}$$

**Traces:**
- In plane $z = p$: ellipse
- In plane $y = q$: parabola
- In plane $x = r$: parabola

The axis corresponds to the **linear variable**.

*[IMAGE PLACEHOLDER: Elliptic paraboloid visualization]*`
  },
  {
    id: 24,
    term: "Hyperbolic Paraboloid",
    category: "Quadric Surfaces",
    hasImage: true, 
    content: `$$z = \\frac{x^2}{a^2} - \\frac{y^2}{b^2}$$

**Traces:**
- In plane $z = p$: hyperbola
- In plane $y = q$: parabola
- In plane $x = r$: parabola

The axis corresponds to the **linear variable**.

*[IMAGE PLACEHOLDER: Hyperbolic paraboloid (saddle) visualization]*`
  }
];

const FlashcardApp: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cards, setCards] = useState<Flashcard[]>(flashcards);
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

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

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = Math.abs(touch.clientY - touchStart.y);
    
    // Only trigger swipe if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > 50 && deltaY < 100) {
      if (deltaX > 0) {
        prevCard();
      } else {
        nextCard();
      }
    }
    
    setTouchStart(null);
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', ' ', 'Enter'].includes(event.key)) {
        event.preventDefault();
      }

      switch (event.key) {
        case 'ArrowLeft':
          prevCard();
          break;
        case 'ArrowRight':
          nextCard();
          break;
        case ' ':
        case 'Enter':
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

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
        integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
        crossOrigin="anonymous"
      />
      
      <div 
        ref={containerRef}
        tabIndex={0}
        className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-3 sm:p-6 focus:outline-none"
      >
        <div className="w-full max-w-4xl">
          
          {/* Header with better mobile spacing */}
          <div className="text-center mb-4 sm:mb-6">
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-500 mb-2">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span className="font-medium">{currentIndex + 1}</span>
                <span className="text-slate-400">/</span>
                <span>{cards.length}</span>
              </div>
              {currentCard.category && (
                <>
                  <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                  <span className="text-slate-600 font-medium">{currentCard.category}</span>
                </>
              )}
            </div>
          </div>

          {/* Card Container with improved mobile design */}
          <div className="relative">
            {/* Navigation buttons - desktop only */}
            <button
              onClick={prevCard}
              className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200/50 items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-white hover:shadow-lg hover:scale-105 transition-all duration-300 group"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
            </button>

            <button
              onClick={nextCard}
              className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200/50 items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-white hover:shadow-lg hover:scale-105 transition-all duration-300 group"
            >
              <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform duration-200" />
            </button>

            {/* Card with touch support */}
            <div 
              className="perspective-1000 mx-2 sm:mx-0"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className={`relative w-full transition-transform duration-200 ease-out ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  height: 'clamp(400px, 60vh, 600px)'
                }}
              >
                {/* Front - Term */}
                <div
                  className="absolute inset-0 w-full h-full bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-3xl shadow-xl p-6 sm:p-10 flex items-center justify-center cursor-pointer hover:bg-white hover:shadow-2xl transition-all duration-300 group"
                  onClick={flipCard}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="text-center max-w-3xl">
                    <div className="mb-4 sm:mb-6">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center">
                          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-semibold text-slate-800 mb-3 sm:mb-4 leading-tight group-hover:text-slate-900 transition-colors duration-300">
                      {currentCard.term}
                    </h2>
                    <p className="text-slate-500 text-xs sm:text-sm font-medium">Tap to reveal formula</p>
                  </div>
                </div>

                {/* Back - Content - Pre-rendered for instant display */}
                <div
                  className="absolute inset-0 w-full h-full bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-3xl shadow-xl p-4 sm:p-10 overflow-y-auto cursor-pointer hover:bg-white hover:shadow-2xl transition-all duration-300"
                  onClick={flipCard}
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <div className="flex items-center justify-center min-h-full">
                    <div className="prose prose-slate max-w-none text-center w-full">
                      <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        components={{
                          h1: ({node, ...props}) => <h1 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-3 sm:mb-4 text-center" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-lg sm:text-xl font-semibold text-slate-700 mb-2 sm:mb-3 text-center" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-base sm:text-lg font-semibold text-slate-600 mb-2 text-center" {...props} />,
                          p: ({node, ...props}) => <p className="mb-3 sm:mb-4 text-slate-700 text-sm sm:text-base leading-relaxed text-center" {...props} />,
                          strong: ({node, ...props}) => <strong className="text-slate-900 font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" {...props} />,
                          em: ({node, ...props}) => <em className="text-blue-600 font-medium not-italic" {...props} />,
                          ul: ({node, ...props}) => <ul className="mb-3 sm:mb-4 space-y-1 text-left inline-block text-sm sm:text-base" {...props} />,
                          li: ({node, ...props}) => <li className="text-slate-700 flex items-start gap-2" {...props} />,
                          code: ({node, inline, ...props}) => 
                            inline 
                              ? <code className="bg-slate-100 px-2 py-1 rounded-md text-xs sm:text-sm text-blue-600 font-mono" {...props} />
                              : <code className="block bg-slate-50 p-3 sm:p-4 rounded-xl overflow-x-auto text-xs sm:text-sm font-mono" {...props} />
                        }}
                      >
                        {currentCard.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Hidden pre-rendering for current and next cards to eliminate math rendering delay */}
            <div className="opacity-0 pointer-events-none absolute -z-10" aria-hidden="true">
              {/* Pre-render current card content */}
              <div className="prose prose-slate max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {currentCard.content}
                </ReactMarkdown>
              </div>
              {/* Pre-render next few cards */}
              {cards.slice(currentIndex + 1, currentIndex + 3).map((card) => (
                <div key={card.id} className="prose prose-slate max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {card.content}
                  </ReactMarkdown>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex sm:hidden justify-center items-center mt-4 gap-4">
            <button
              onClick={prevCard}
              className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/50 flex items-center justify-center text-slate-400 active:scale-95 transition-all duration-200"
            >
              <ChevronLeft size={20} />
            </button>
            
            <button
              onClick={flipCard}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold rounded-2xl active:scale-95 transition-all duration-200 shadow-lg"
            >
              Flip
            </button>

            <button
              onClick={nextCard}
              className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/50 flex items-center justify-center text-slate-400 active:scale-95 transition-all duration-200"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Desktop Controls */}
          <div className="hidden sm:flex justify-center items-center mt-6 gap-4">
            <button
              onClick={shuffleCards}
              className="w-11 h-11 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/50 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-white hover:scale-105 transition-all duration-200"
              title="Shuffle Cards"
            >
              <Shuffle size={16} />
            </button>

            <button
              onClick={flipCard}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold rounded-2xl hover:from-blue-600 hover:to-purple-700 hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Flip Card
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center mt-6">
            <div className="flex gap-1.5 p-2 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/50">
              {cards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsFlipped(false);
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentIndex
                      ? 'w-6 h-2 bg-gradient-to-r from-blue-500 to-purple-600'
                      : 'w-2 h-2 bg-slate-300 hover:bg-slate-400 active:scale-110'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Keyboard Hints - Desktop Only */}
          <div className="hidden sm:block text-center text-xs text-slate-400 mt-6">
            <span>← → navigate • space flip • ⌘S shuffle • swipe on mobile</span>
          </div>

          {/* Mobile Hint */}
          <div className="sm:hidden text-center text-xs text-slate-400 mt-4">
            <span>Swipe left/right to navigate • Tap to flip</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 { 
          perspective: 1000px; 
        }
        
        .rotate-y-180 { 
          transform: rotateY(180deg); 
        }
        
        .katex-display {
          margin: 1rem 0 !important;
          text-align: center;
        }
        
        .katex { 
          font-size: 1rem;
          color: #334155;
        }
        
        .katex-display .katex {
          font-size: 1.15rem;
        }
        
        @media (max-width: 640px) {
          .katex { 
            font-size: 0.9rem; 
          }
          .katex-display .katex { 
            font-size: 1rem; 
          }
          .katex-display { 
            overflow-x: auto;
            margin: 0.75rem 0 !important;
          }
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 4px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Smooth touch interactions */
        * {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </>
  );
};

export default FlashcardApp;