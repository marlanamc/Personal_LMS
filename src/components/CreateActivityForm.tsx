"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type QuizQuestionType = "text" | "single" | "multiple";

type QuizQuestion = {
    id: number;
    question: string;
    type: QuizQuestionType;
    options: string[];
};

export default function CreateActivityForm() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("worksheet");
    const [category, setCategory] = useState("");
    const [level, setLevel] = useState("");
    const [contentType, setContentType] = useState("simple"); // simple, quiz, structured
    const [content, setContent] = useState("");
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([{ id: 1, question: "", type: "text", options: [] }]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const addQuizQuestion = () => {
        setQuizQuestions([...quizQuestions, {
            id: quizQuestions.length + 1,
            question: "",
            type: "text",
            options: [],
        }]);
    };

    const updateQuizQuestion = <K extends keyof QuizQuestion>(index: number, field: K, value: QuizQuestion[K]) => {
        const updated = [...quizQuestions];
        updated[index] = { ...updated[index], [field]: value };
        setQuizQuestions(updated);
    };

    const removeQuizQuestion = (index: number) => {
        setQuizQuestions(quizQuestions.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!title.trim()) {
            setError("Title is required");
            return;
        }

        let activityContent;
        if (contentType === "quiz") {
            const validQuestions = quizQuestions.filter((q) => q.question.trim());
            if (validQuestions.length === 0) {
                setError("Please add at least one question");
                return;
            }
            activityContent = JSON.stringify({ questions: validQuestions });
        } else {
            if (!content.trim()) {
                setError("Content is required");
                return;
            }
            activityContent = JSON.stringify({ content });
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/activities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description: description || null,
                    type,
                    category: category || null,
                    level: level || null,
                    content: activityContent,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to create activity");
            }

            router.push("/dashboard/activities");
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to create activity");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                        
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                autoComplete="off"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                autoComplete="off"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                                    Type *
                                </label>
                                <select
                                    id="type"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900"
                                    required
                                >
                                    <option value="worksheet">Worksheet</option>
                                    <option value="quiz">Quiz</option>
                                    <option value="slides">Slides</option>
                                    <option value="guide">Guide</option>
                                    <option value="game">Game</option>
                                    <option value="resource">Resource</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900"
                                >
                                    <option value="">Select category</option>
                                    <option value="grammar">Grammar</option>
                                    <option value="vocab">Vocabulary</option>
                                    <option value="speaking">Speaking</option>
                                    <option value="writing-reading">Writing/Reading</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="level" className="block text-sm font-medium text-gray-700">
                                    Level
                                </label>
                                <select
                                    id="level"
                                    value={level}
                                    onChange={(e) => setLevel(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900"
                                >
                                    <option value="">Select level</option>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Content Type */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Content</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Content Format
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="contentType"
                                        value="simple"
                                        checked={contentType === "simple"}
                                        onChange={(e) => setContentType(e.target.value)}
                                        className="mr-2"
                                    />
                                    Simple Text
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="contentType"
                                        value="quiz"
                                        checked={contentType === "quiz"}
                                        onChange={(e) => setContentType(e.target.value)}
                                        className="mr-2"
                                    />
                                    Quiz Questions
                                </label>
                            </div>
                        </div>

                        {contentType === "quiz" ? (
                            <div className="space-y-4">
                                {quizQuestions.map((question, index) => (
                                    <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-medium text-gray-900">Question {index + 1}</h4>
                                            {quizQuestions.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeQuizQuestion(index)}
                                                    className="text-red-600 hover:text-red-800 text-sm"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Question
                                                </label>
                                                <input
                                                    type="text"
                                                    value={question.question}
                                                    onChange={(e) => updateQuizQuestion(index, "question", e.target.value)}
                                                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900"
                                                    placeholder="Enter question…"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Question Type
                                                </label>
                                                <select
                                                    value={question.type}
                                                    onChange={(e) => {
                                                        const newType = e.target.value as QuizQuestionType;
                                                        updateQuizQuestion(index, "type", newType);
                                                        if (newType === "multiple" || newType === "single") {
                                                            updateQuizQuestion(index, "options", ["", "", "", ""]);
                                                        } else {
                                                            updateQuizQuestion(index, "options", []);
                                                        }
                                                    }}
                                                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900"
                                                >
                                                    <option value="text">Text Answer</option>
                                                    <option value="single">Single Choice</option>
                                                    <option value="multiple">Multiple Choice</option>
                                                </select>
                                            </div>
                                            {(question.type === "single" || question.type === "multiple") && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Options
                                                    </label>
                                                    {question.options.map((option, optIndex) => (
                                                        <input
                                                            key={optIndex}
                                                            type="text"
                                                            value={option}
                                                            onChange={(e) => {
                                                                const newOptions = [...question.options];
                                                                newOptions[optIndex] = e.target.value;
                                                                updateQuizQuestion(index, "options", newOptions);
                                                            }}
                                                            className="w-full mb-2 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900"
                                                            placeholder={`Option ${optIndex + 1}`}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addQuizQuestion}
                                    className="w-full px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    + Add Question
                                </button>
                            </div>
                        ) : (
                            <div>
                                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                                    Content *
                                </label>
                                <textarea
                                    id="content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    rows={12}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900 font-mono text-sm"
                                    placeholder="Enter activity content…"
                                    required={contentType === "simple"}
                                />
                                <p className="mt-2 text-sm text-gray-500">
                                    You can use markdown-style formatting or plain text.
                                </p>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isLoading ? "Creating…" : "Create Activity"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}









