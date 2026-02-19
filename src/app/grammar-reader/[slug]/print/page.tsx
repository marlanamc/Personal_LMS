import { notFound } from "next/navigation";
import { getGrammarContent } from "@/lib/grammar-content-loader";
import {
    getExerciseAnswerExpectation,
    getExerciseAnswerExpectationMessage,
} from "@/lib/exercise-answer-expectation";
import { sanitizeHtml } from "@/utils/sanitize";

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function GrammarPrintPage({ params }: Props) {
    const { slug } = await params;
    const content = await getGrammarContent(slug);

    if (!content) {
        notFound();
    }

    // Get guide title from introduction section, or format from slug
    let guideTitle: string;
    const introductionSection = content.sections.find(s => s.id === "introduction");
    if (introductionSection?.title && introductionSection.title.includes("Guide")) {
        // Use the introduction title if it already has "Guide"
        // Convert "&" to "and" for better readability in print
        guideTitle = introductionSection.title.replace(/\s*&\s*/g, " and ");
    } else {
        // Format from slug and add "Guide"
        const formattedSlug = slug
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        
        // Handle special cases for better formatting
        const formattedTitle = formattedSlug
            .replace(/\s+Vs\s+/gi, " vs ")
            .replace(/\s+And\s+/gi, " and ");
        
        // Add "Guide" at the end
        guideTitle = `${formattedTitle} Guide`;
    }

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    @page {
                        margin: 1in;
                    }
                    body {
                        background: white;
                    }
                    .page-break {
                        page-break-before: always;
                    }
                    .section-break {
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                    .print-all-sections {
                        min-height: auto !important;
                        padding: 1rem !important;
                    }
                    .guide-header {
                        page-break-after: avoid;
                        break-after: avoid;
                        page-break-inside: avoid;
                        break-inside: avoid;
                        margin-bottom: 1.5rem !important;
                        padding-bottom: 0.75rem !important;
                    }
                    .guide-header h1 {
                        font-size: 2rem !important;
                        margin-bottom: 0.25rem !important;
                    }
                    .guide-header p {
                        font-size: 1rem !important;
                        margin-bottom: 0 !important;
                    }
                    .section:first-of-type {
                        page-break-before: avoid;
                        break-before: avoid;
                    }
                }
                .print-all-sections {
                    max-width: 8.5in;
                    margin: 0 auto;
                    min-height: 100vh;
                    background: white;
                    padding: 2rem;
                }
                .guide-header {
                    text-align: center;
                    margin-bottom: 3rem;
                    border-bottom: 3px solid #000;
                    padding-bottom: 1rem;
                }
                .guide-header h1 {
                    font-size: 2.5rem;
                    margin-bottom: 0.5rem;
                }
                .section {
                    margin-bottom: 3rem;
                    padding-bottom: 2rem;
                    border-bottom: 1px solid #ddd;
                }
                .section-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 2px solid #333;
                }
                .section-number {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #666;
                    min-width: 3rem;
                }
                .section-title {
                    font-size: 1.75rem;
                    font-weight: bold;
                    flex: 1;
                }
                .section-icon {
                    font-size: 2rem;
                }
                .explanation {
                    line-height: 1.8;
                    margin-bottom: 1.5rem;
                }
                .explanation h3 {
                    font-size: 1.25rem;
                    margin-top: 1.5rem;
                    margin-bottom: 0.75rem;
                }
                .explanation h4 {
                    font-size: 1.1rem;
                    margin-top: 1rem;
                    margin-bottom: 0.5rem;
                }
                .explanation ul,
                .explanation ol {
                    margin-left: 1.5rem;
                    margin-bottom: 1rem;
                }
                .explanation li {
                    margin-bottom: 0.5rem;
                }
                .explanation p {
                    margin-bottom: 1rem;
                }
                .explanation table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 1rem 0;
                }
                .explanation th,
                .explanation td {
                    border: 1px solid #ddd;
                    padding: 0.75rem;
                    text-align: left;
                }
                .explanation th {
                    background: #f5f5f5;
                    font-weight: bold;
                }
                .tip-box {
                    background: #f0f9ff;
                    border-left: 4px solid #3b82f6;
                    padding: 1rem 1.5rem;
                    margin: 1.5rem 0;
                }
                .tip-box h4 {
                    margin-top: 0;
                    color: #1e40af;
                }
                .exercises {
                    margin-top: 2rem;
                    padding-top: 1.5rem;
                    border-top: 1px dashed #ccc;
                }
                .exercise {
                    margin-bottom: 2rem;
                }
                .exercise-title {
                    font-weight: bold;
                    font-size: 1.1rem;
                    margin-bottom: 0.5rem;
                }
                .exercise-instructions {
                    font-style: italic;
                    color: #666;
                    margin-bottom: 1rem;
                }
                .exercise-answer-expectation {
                    font-style: normal;
                    font-weight: 600;
                    color: #111;
                    margin-top: 0.35rem;
                }
                .exercise-item {
                    margin-bottom: 1.5rem;
                    padding-left: 1.5rem;
                }
                .exercise-item-label {
                    font-weight: 500;
                    margin-bottom: 0.5rem;
                }
                .exercise-item-options {
                    margin-left: 1rem;
                }
                .exercise-item-option {
                    padding: 0.25rem 0;
                }
                .formula-box {
                    background: #f9fafb;
                    border: 2px solid #e5e7eb;
                    border-radius: 0.5rem;
                    padding: 1.5rem;
                    margin: 1.5rem 0;
                }
                .examples-box {
                    background: #fef3c7;
                    border-left: 4px solid #f59e0b;
                    padding: 1rem 1.5rem;
                    margin: 1.5rem 0;
                }
                .examples-box h4 {
                    margin-top: 0;
                    color: #92400e;
                }
                .comparison-table {
                    margin: 1.5rem 0;
                }
                .usage-meanings {
                    margin-top: 2rem;
                }
                .time-expressions {
                    margin-top: 2rem;
                }
                .verb-table {
                    margin-top: 2rem;
                }
            ` }} />
            <div className="print-all-sections">

            <div className="guide-header">
                <h1>{guideTitle}</h1>
                <p style={{ color: "#666", fontSize: "1.1rem" }}>
                    Complete Grammar Guide - All Sections
                </p>
            </div>

            {content.sections.map((section, index) => (
                <div
                    key={section.id || index}
                    className="section section-break"
                    style={
                        index > 0 && index % 5 === 0
                            ? { pageBreakBefore: "always" }
                            : {}
                    }
                >
                    <div className="section-header">
                        {section.stepNumber && (
                            <span className="section-number">
                                {section.stepNumber}
                            </span>
                        )}
                        {section.icon && (
                            <span className="section-icon">{section.icon}</span>
                        )}
                        <h2 className="section-title">{section.title}</h2>
                    </div>

                    {section.explanation && (
                        <div
                            className="explanation"
                            dangerouslySetInnerHTML={{
                                __html: sanitizeHtml(section.explanation, {
                                    allowStyles: true,
                                }),
                            }}
                        />
                    )}

                    {section.tipBox && (
                        <div className="tip-box">
                            <h4>{section.tipBox.title}</h4>
                            <p>{section.tipBox.content}</p>
                        </div>
                    )}

                    {section.formula && section.formula.length > 0 && (
                        <div className="formula-box">
                            <h4>Formula</h4>
                            <div>
                                {section.formula.map((part, idx) => (
                                    <span key={idx} style={{ marginRight: "0.5rem" }}>
                                        <strong>{part.text}</strong>
                                        {part.type && (
                                            <span
                                                style={{
                                                    fontSize: "0.875rem",
                                                    color: "#666",
                                                    marginLeft: "0.25rem",
                                                }}
                                            >
                                                ({part.type})
                                            </span>
                                        )}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {section.examples && section.examples.length > 0 && (
                        <div className="examples-box">
                            <h4>Examples</h4>
                            <ul>
                                {section.examples.map((example, idx) => (
                                    <li key={idx}>{example}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {section.comparison && (
                        <div className="comparison-table">
                            <h4>{section.comparison.title}</h4>
                            <table>
                                <thead>
                                    <tr>
                                        <th>{section.comparison.leftLabel}</th>
                                        <th>{section.comparison.rightLabel}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {section.comparison.rows.map((row, idx) => (
                                        <tr key={idx}>
                                            <td>{row.left}</td>
                                            <td>{row.right}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {section.usageMeanings && section.usageMeanings.length > 0 && (
                        <div className="usage-meanings">
                            <h3>Usage Meanings</h3>
                            {section.usageMeanings.map((meaning, idx) => (
                                <div key={idx} style={{ marginBottom: "1.5rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "0.5rem" }}>
                                    <h4 style={{ marginTop: 0, marginBottom: "0.5rem" }}>{meaning.title}</h4>
                                    <p style={{ marginBottom: "1rem" }}>{meaning.description}</p>
                                    {meaning.examples && meaning.examples.length > 0 && (
                                        <div>
                                            <strong>Examples:</strong>
                                            <ul>
                                                {meaning.examples.map((example, exIdx) => (
                                                    <li key={exIdx} style={{ marginBottom: "0.5rem" }}>
                                                        <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(example.sentence, { allowStyles: true }) }} />
                                                        {example.explanation && (
                                                            <div style={{ fontStyle: "italic", color: "#666", marginTop: "0.25rem" }}>
                                                                {example.explanation}
                                                            </div>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {section.timeExpressions && section.timeExpressions.length > 0 && (
                        <div className="time-expressions">
                            <h3>Common Time Expressions</h3>
                            <table style={{ width: "100%", marginTop: "1rem" }}>
                                <thead>
                                    <tr>
                                        <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #ddd" }}>Word</th>
                                        <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #ddd" }}>Usage</th>
                                        <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #ddd" }}>Examples</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {section.timeExpressions.map((expr, idx) => (
                                        <tr key={idx}>
                                            <td style={{ padding: "0.75rem", border: "1px solid #ddd", fontWeight: "bold" }}>{expr.word}</td>
                                            <td style={{ padding: "0.75rem", border: "1px solid #ddd" }}>{expr.usage}</td>
                                            <td style={{ padding: "0.75rem", border: "1px solid #ddd" }}>
                                                <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                                                    {expr.examples.map((ex, exIdx) => (
                                                        <li key={exIdx}>{ex}</li>
                                                    ))}
                                                </ul>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {section.verbTable && (
                        <div className="verb-table">
                            <h3>{section.verbTable.title}</h3>
                            <table style={{ width: "100%", marginTop: "1rem" }}>
                                <thead>
                                    <tr>
                                        {section.verbTable.headers.map((header, idx) => (
                                            <th key={idx} style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #ddd", background: "#f5f5f5", fontWeight: "bold" }}>
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {section.verbTable.rows.map((row, rowIdx) => (
                                        <tr key={rowIdx}>
                                            {row.map((cell, cellIdx) => (
                                                <td key={cellIdx} style={{ padding: "0.75rem", border: "1px solid #ddd" }}>
                                                    {cell}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {section.timeline && (
                        <div className="timeline" style={{ marginTop: "2rem", padding: "1.5rem", border: "2px solid #333", borderRadius: "0.5rem" }}>
                            <h3>{section.timeline.title}</h3>
                            <p style={{ marginBottom: "1rem" }}>{section.timeline.description}</p>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2rem", padding: "1rem", position: "relative" }}>
                                <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "2px", background: "#ddd", zIndex: 0 }}></div>
                                {[...section.timeline.events].sort((a, b) => a.order - b.order).map((event, idx) => (
                                    <div key={idx} style={{ position: "relative", zIndex: 1, textAlign: "center", flex: 1 }}>
                                        <div style={{ fontSize: "0.875rem", fontWeight: "bold", color: "#666", marginBottom: "0.5rem" }}>
                                            {event.tenseLabel}
                                        </div>
                                        <div style={{ width: "48px", height: "48px", borderRadius: "50%", border: "4px solid #333", background: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.25rem", margin: "0 auto" }}>
                                            {event.order}
                                        </div>
                                        <div style={{ marginTop: "0.5rem", fontSize: "0.875rem", maxWidth: "120px", marginLeft: "auto", marginRight: "auto" }}>
                                            {event.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {section.exercises && section.exercises.length > 0 && (
                        <div className="exercises">
                            <h3>Practice Exercises</h3>
                            {section.exercises.map((exercise) => {
                                const answerExpectation = getExerciseAnswerExpectation(exercise);
                                const answerExpectationMessage =
                                    getExerciseAnswerExpectationMessage(answerExpectation);

                                return (
                                <div key={exercise.id} className="exercise">
                                    <div className="exercise-title">
                                        {exercise.title}
                                    </div>
                                    {(exercise.instructions || answerExpectationMessage) && (
                                        <div className="exercise-instructions">
                                            {exercise.instructions && <div>{exercise.instructions}</div>}
                                            {answerExpectationMessage && (
                                                <div className="exercise-answer-expectation">
                                                    Expected input: {answerExpectationMessage}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {exercise.items.map((item, itemIdx) => (
                                        <div
                                            key={itemIdx}
                                            className="exercise-item"
                                        >
                                            <div className="exercise-item-label">
                                                {itemIdx + 1}. {item.label}
                                            </div>
                                            {item.type === "radio" &&
                                                item.options && (
                                                    <div className="exercise-item-options">
                                                        {item.options.map(
                                                            (opt, optIdx) => (
                                                                <div
                                                                    key={optIdx}
                                                                    className="exercise-item-option"
                                                                >
                                                                    {String.fromCharCode(
                                                                        97 +
                                                                            optIdx
                                                                    )}
                                                                    ) {opt.label}
                                                                    {opt.value ===
                                                                        item.expectedAnswer && (
                                                                        <span
                                                                            style={{
                                                                                marginLeft:
                                                                                    "0.5rem",
                                                                                color: "#059669",
                                                                                fontWeight:
                                                                                    "bold",
                                                                            }}
                                                                        >
                                                                            ✓
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            {item.type === "text" &&
                                                item.expectedAnswer && (
                                                    <div
                                                        style={{
                                                            marginLeft: "1rem",
                                                            fontStyle: "italic",
                                                            color: "#666",
                                                        }}
                                                    >
                                                        Answer:{" "}
                                                        <strong>
                                                            {
                                                                item.expectedAnswer
                                                            }
                                                        </strong>
                                                    </div>
                                                )}
                                            {item.type === "select" &&
                                                item.options && (
                                                    <div
                                                        style={{
                                                            marginLeft: "1rem",
                                                            fontStyle: "italic",
                                                            color: "#666",
                                                        }}
                                                    >
                                                        Options:{" "}
                                                        {item.options.join(
                                                            ", "
                                                        )}
                                                        {item.expectedAnswer && (
                                                            <span
                                                                style={{
                                                                    display:
                                                                        "block",
                                                                    marginTop:
                                                                        "0.25rem",
                                                                }}
                                                            >
                                                                Answer:{" "}
                                                                <strong>
                                                                    {
                                                                        item.expectedAnswer
                                                                    }
                                                                </strong>
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                    ))}
                                </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            ))}

            {content.miniQuiz && content.miniQuiz.length > 0 && (
                <div className="section page-break">
                    <div className="section-header">
                        <h2 className="section-title">Mini Quiz</h2>
                    </div>
                    <div className="exercises">
                        {content.miniQuiz.map((question, idx) => (
                            <div key={question.id || idx} className="exercise">
                                <div className="exercise-item-label">
                                    {idx + 1}. {question.question}
                                </div>
                                {question.options && (
                                    <div className="exercise-item-options">
                                        {question.options.map((opt, optIdx) => (
                                            <div
                                                key={optIdx}
                                                className="exercise-item-option"
                                            >
                                                {String.fromCharCode(97 + optIdx)}
                                                ) {opt.label}
                                                {opt.value ===
                                                    question.correctAnswer && (
                                                    <span
                                                        style={{
                                                            marginLeft:
                                                                "0.5rem",
                                                            color: "#059669",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        ✓
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {question.explanation && (
                                    <div
                                        style={{
                                            marginTop: "0.5rem",
                                            paddingLeft: "1.5rem",
                                            fontStyle: "italic",
                                            color: "#666",
                                        }}
                                    >
                                        <strong>Explanation:</strong>{" "}
                                        {question.explanation}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
        </>
    );
}
