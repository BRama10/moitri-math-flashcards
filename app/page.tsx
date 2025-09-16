'use client'

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle, BookOpen } from 'lucide-react';

// Import KaTeX CSS (in a real app, you'd import this in your main CSS file)
// import 'katex/dist/katex.min.css';

interface Flashcard {
  id: number;
  term: string;
  content: string;
  image?: string;
  category?: string;
}

// Sample flashcard data with proper LaTeX formatting
const sampleCards: Flashcard[] = [
  {
    id: 1,
    term: "Vector Magnitude",
    category: "Linear Algebra",
    content: `The **magnitude** (or length) of a vector $\\vec{v} = (x_1, y_1, z_1)$ is calculated using:

$$||\\vec{v}|| = \\sqrt{x_1^2 + y_1^2 + z_1^2}$$

This represents the distance from the origin to the point $(x_1, y_1, z_1)$ in 3D space.

### Key Properties:
- Always non-negative: $||\\vec{v}|| \\geq 0$
- Zero only for the zero vector: $||\\vec{v}|| = 0 \\iff \\vec{v} = \\vec{0}$
- Satisfies the triangle inequality: $||\\vec{u} + \\vec{v}|| \\leq ||\\vec{u}|| + ||\\vec{v}||$

### Example:
For $\\vec{v} = (3, 4, 5)$:
$$||\\vec{v}|| = \\sqrt{3^2 + 4^2 + 5^2} = \\sqrt{9 + 16 + 25} = \\sqrt{50} = 5\\sqrt{2}$$`,
  },
  {
    id: 2,
    term: "Unit Vector",
    category: "Linear Algebra", 
    content: `A **unit vector** is a vector with magnitude 1. To find the unit vector in the direction of $\\vec{v}$:

$$\\hat{v} = \\frac{\\vec{v}}{||\\vec{v}||} = \\frac{1}{||\\vec{v}||}(x_1, y_1, z_1)$$

where $\\vec{v} \\neq \\vec{0}$.

### Applications:
- **Direction representation**: Pure direction without magnitude
- **Computer graphics**: Normalizing vectors for lighting calculations  
- **Coordinate systems**: Basis vectors $\\hat{i}$, $\\hat{j}$, $\\hat{k}$

### Standard Unit Vectors:
$$\\hat{i} = (1, 0, 0), \\quad \\hat{j} = (0, 1, 0), \\quad \\hat{k} = (0, 0, 1)$$

### Example:
For $\\vec{v} = (6, 8, 0)$ with $||\\vec{v}|| = 10$:
$$\\hat{v} = \\frac{1}{10}(6, 8, 0) = (0.6, 0.8, 0)$$`,
  },
  {
    id: 3,
    term: "Distance Formula in 3D",
    category: "Analytic Geometry",
    content: `The **distance** between two points $P_1(x_1, y_1, z_1)$ and $P_2(x_2, y_2, z_2)$ is:

$$d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2 + (z_2-z_1)^2}$$

This is derived from the **Pythagorean theorem** extended to 3D space.

### Derivation:
1. Create a vector from $P_1$ to $P_2$: $\\vec{v} = (x_2-x_1, y_2-y_1, z_2-z_1)$
2. The distance is the magnitude: $d = ||\\vec{v}||$

### Special Cases:
- **2D distance**: $d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$
- **1D distance**: $d = |x_2 - x_1|$

### Example:
Distance between $(1,2,3)$ and $(4,6,8)$:
$$d = \\sqrt{(4-1)^2 + (6-2)^2 + (8-3)^2} = \\sqrt{9+16+25} = \\sqrt{50} = 5\\sqrt{2} \\approx 7.07$$`,
  },
  {
    id: 4,
    term: "Equation of a Sphere",
    category: "Analytic Geometry",
    content: `A **sphere** with center $(a,b,c)$ and radius $r$ has the equation:

$$(x-a)^2 + (y-b)^2 + (z-c)^2 = r^2$$

### Special Forms:

**Unit sphere** (center at origin, $r=1$):
$$x^2 + y^2 + z^2 = 1$$

**General form**:
$$x^2 + y^2 + z^2 + Dx + Ey + Fz + G = 0$$

### Converting General to Standard Form:
Complete the square for each variable:

Given: $x^2 + y^2 + z^2 + 2x - 4y + 6z + 5 = 0$

1. Group terms: $(x^2 + 2x) + (y^2 - 4y) + (z^2 + 6z) = -5$
2. Complete squares: $(x+1)^2 - 1 + (y-2)^2 - 4 + (z+3)^2 - 9 = -5$
3. Simplify: $(x+1)^2 + (y-2)^2 + (z+3)^2 = 9$

**Result**: Center $(-1, 2, -3)$, radius $r = 3$`,
  },
  {
    id: 5,
    term: "Elliptic Cone",
    category: "Quadric Surfaces",
    content: `An **elliptic cone** has the equation:

$$\\frac{x^2}{a^2} + \\frac{y^2}{b^2} - \\frac{z^2}{c^2} = 0$$

### Characteristics:
- **Double cone** opening along the z-axis
- **Vertex** at the origin $(0, 0, 0)$
- **Axis** corresponds to the variable with **negative coefficient**

### Traces (Cross-sections):

| Plane | Trace | Equation |
|-------|--------|----------|
| $z = p$ (constant) | Ellipse | $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = \\frac{p^2}{c^2}$ |
| $y = q$ (constant) | Hyperbola | $\\frac{x^2}{a^2} - \\frac{z^2}{c^2} = -\\frac{q^2}{b^2}$ |
| $x = r$ (constant) | Hyperbola | $\\frac{y^2}{b^2} - \\frac{z^2}{c^2} = -\\frac{r^2}{a^2}$ |

### Special Case:
When $a = b$, we get a **circular cone**:
$$\\frac{x^2 + y^2}{a^2} = \\frac{z^2}{c^2}$$`,
  },
  {
    id: 6,
    term: "Elliptic Paraboloid",
    category: "Quadric Surfaces",
    content: `An **elliptic paraboloid** has the equation:

$$z = \\frac{x^2}{a^2} + \\frac{y^2}{b^2}$$

### Characteristics:
- **Bowl-shaped** surface opening upward
- **Vertex** (minimum point) at origin
- **Axis** corresponds to the linear variable

### Traces (Cross-sections):

| Plane | Trace | Shape |
|-------|--------|--------|
| $z = p > 0$ | $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = p$ | Ellipse |
| $y = q$ | $z = \\frac{x^2}{a^2} + \\frac{q^2}{b^2}$ | Parabola |
| $x = r$ | $z = \\frac{r^2}{a^2} + \\frac{y^2}{b^2}$ | Parabola |

### Applications:
- **Satellite dishes**: Parabolic reflectors focus signals
- **Optimization**: Represents quadratic functions with minimum
- **Architecture**: Paraboloid roof structures

### Example:
For $z = x^2 + 4y^2$, we have $a^2 = 1$ and $b^2 = \\frac{1}{4}$`,
  },
  {
    id: 7,
    term: "Hyperbolic Paraboloid",
    category: "Quadric Surfaces", 
    content: `A **hyperbolic paraboloid** (saddle surface) has the equation:

$$z = \\frac{x^2}{a^2} - \\frac{y^2}{b^2}$$

### Characteristics:
- **Saddle-shaped** surface
- **No vertex** (no maximum or minimum)
- **Mixed curvature**: curves up in one direction, down in another

### Traces (Cross-sections):

| Plane | Trace | Shape |
|-------|--------|--------|
| $z = p \\neq 0$ | $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = p$ | Hyperbola |
| $y = q$ | $z = \\frac{x^2}{a^2} - \\frac{q^2}{b^2}$ | Parabola |
| $x = r$ | $z = \\frac{r^2}{a^2} - \\frac{y^2}{b^2}$ | Parabola |

### Special Lines:
The lines $y = \\pm \\frac{b}{a}x$ (where $z = 0$) are called **asymptotic lines**.

### Applications:
- **Architecture**: Saddle roofs and cooling towers
- **Mathematics**: Critical point analysis (saddle points)
- **Physics**: Potential energy surfaces

### Example:
$z = x^2 - y^2$ is the simplest hyperbolic paraboloid with $a = b = 1$`,
  }
];

const FlashcardApp: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cards, setCards] = useState<Flashcard[]>(sampleCards);
  const [isShuffled, setIsShuffled] = useState(false);

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
    setIsShuffled(!isShuffled);
  };

  // Keyboard navigation
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
      {/* KaTeX CSS */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
        integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
        crossOrigin="anonymous"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="text-indigo-600" size={32} />
              <h1 className="text-4xl font-bold text-gray-800">
                Mathematics Flashcards
              </h1>
            </div>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <span className="bg-white px-3 py-1 rounded-full shadow-sm">
                Card {currentIndex + 1} of {cards.length}
              </span>
              {currentCard.category && (
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                  {currentCard.category}
                </span>
              )}
            </div>
          </div>

          {/* Flashcard Container */}
          <div className="relative perspective-1000 mb-8">
            <div
              className={`relative w-full min-h-[500px] transform-style-preserve-3d transition-transform duration-700 ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              {/* Front of card - Term */}
              <div
                className="absolute inset-0 w-full min-h-[500px] backface-hidden bg-white rounded-2xl shadow-2xl border border-gray-100 p-12 flex items-center justify-center cursor-pointer hover:shadow-3xl transition-shadow duration-300"
                onClick={flipCard}
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="text-center max-w-2xl">
                  <h2 className="text-5xl font-bold text-gray-800 mb-6 leading-tight">
                    {currentCard.term}
                  </h2>
                  <div className="space-y-3 text-gray-500">
                    <p className="text-lg">Click to reveal definition</p>
                    <div className="flex items-center justify-center gap-4 text-sm">
                      <span className="bg-gray-100 px-3 py-1 rounded-full">Space / Enter</span>
                      <span>•</span>
                      <span className="bg-gray-100 px-3 py-1 rounded-full">← → Navigate</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of card - Content */}
              <div
                className="absolute inset-0 w-full min-h-[500px] backface-hidden bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 overflow-y-auto cursor-pointer hover:shadow-3xl transition-shadow duration-300"
                onClick={flipCard}
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                <div className="prose prose-lg prose-indigo max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      // Custom styling for different elements
                      h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-gray-700 mb-3 mt-6" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-lg font-medium text-gray-600 mb-2 mt-4" {...props} />,
                      p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-gray-700" {...props} />,
                      ul: ({node, ...props}) => <ul className="mb-4 space-y-2" {...props} />,
                      li: ({node, ...props}) => <li className="text-gray-700" {...props} />,
                      table: ({node, ...props}) => <table className="border-collapse border border-gray-300 w-full mb-4" {...props} />,
                      th: ({node, ...props}) => <th className="border border-gray-300 bg-gray-50 p-2 text-left font-semibold" {...props} />,
                      td: ({node, ...props}) => <td className="border border-gray-300 p-2" {...props} />,
                      code: ({node, inline, ...props}) => 
                        inline 
                          ? <code className="bg-gray-100 px-2 py-1 rounded text-sm" {...props} />
                          : <code className="block bg-gray-100 p-4 rounded-lg overflow-x-auto" {...props} />
                    }}
                  >
                    {currentCard.content}
                  </ReactMarkdown>
                  
                  {currentCard.image && (
                    <div className="mt-8 text-center">
                      <img
                        src={currentCard.image}
                        alt={`Illustration for ${currentCard.term}`}
                        className="max-w-full h-auto rounded-xl shadow-lg border border-gray-200"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={prevCard}
              className="flex items-center gap-3 px-6 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-gray-700 hover:text-gray-900 border border-gray-200"
              disabled={cards.length <= 1}
            >
              <ChevronLeft size={20} />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center gap-4">
              <button
                onClick={shuffleCards}
                className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl shadow-md hover:shadow-lg hover:bg-green-700 transition-all duration-200"
                title="Shuffle cards (Ctrl+S)"
              >
                <Shuffle size={18} />
                <span className="hidden sm:inline">Shuffle</span>
              </button>

              <button
                onClick={flipCard}
                className="flex items-center gap-3 px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-md hover:shadow-lg hover:bg-indigo-700 transition-all duration-200"
              >
                <RotateCcw size={20} />
                <span className="hidden sm:inline">Flip Card</span>
              </button>
            </div>

            <button
              onClick={nextCard}
              className="flex items-center gap-3 px-6 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-gray-700 hover:text-gray-900 border border-gray-200"
              disabled={cards.length <= 1}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex justify-center gap-2 mb-2">
              {cards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsFlipped(false);
                  }}
                  className={`w-4 h-4 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? 'bg-indigo-600 scale-110'
                      : 'bg-gray-300 hover:bg-gray-400 hover:scale-105'
                  }`}
                  title={`Go to card ${index + 1}: ${cards[index].term}`}
                />
              ))}
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="text-center text-sm text-gray-500 bg-white/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex flex-wrap justify-center gap-4">
              <span className="flex items-center gap-2">
                <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">←</kbd>
                <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">→</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-2">
                <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">Space</kbd>
                <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">Enter</kbd>
                Flip
              </span>
              <span className="flex items-center gap-2">
                <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">Ctrl</kbd>+
                <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">S</kbd>
                Shuffle
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
        
        /* Custom KaTeX styling */
        .katex-display {
          margin: 1.5em 0 !important;
          text-align: center;
        }
        
        .katex {
          font-size: 1.1em;
        }
        
        /* Ensure math renders properly */
        .katex-display > .katex {
          display: inline-block;
          white-space: nowrap;
        }
        
        /* Table styling for better math content */
        .prose table {
          border-collapse: collapse;
          margin: 1.5em 0;
          width: 100%;
        }
        
        .prose th,
        .prose td {
          border: 1px solid #d1d5db;
          padding: 0.75rem;
          text-align: left;
        }
        
        .prose th {
          background-color: #f9fafb;
          font-weight: 600;
        }
        
        /* Responsive adjustments */
        @media (max-width: 640px) {
          .katex {
            font-size: 0.9em;
          }
          
          .katex-display {
            overflow-x: auto;
            overflow-y: hidden;
          }
        }
      `}</style>
    </>
  );
};

export default FlashcardApp;