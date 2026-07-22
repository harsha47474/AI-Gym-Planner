import { RedirectToSignIn, SignedIn } from "@neondatabase/neon-js/auth/react";
import { useAuth } from "../context/AuthContext";
import { Target, Dumbbell, Calendar, Sparkles, Check, Split, House, Loader2 } from "lucide-react";
import Button from "../components/ui/Button";
import ProgressBar from "../components/ui/ProgressBar";
import OptionCard from "../components/ui/OptionCard";
import { useState } from "react";
import Input from "../components/ui/Input";
import { useNavigate } from "react-router-dom";
import type { UserProfile } from "../types";


const steps = [
    {
        title: "What's your goal?",
        subtitle: "Choose your primary fitness objective.",
        icon: Target,
    },
    {
        title: "Tell us about yourself",
        subtitle: "We'll personalize your workout plan.",
        icon: Dumbbell,
    },
    {
        title: "Workout Preferences",
        subtitle: "Choose how and when you train.",
        icon: Calendar,
    },
    {
        title: "Preferred Splits",
        subtitle: "Choose which of the following splits your prefer",
        icon: Split,
    },
    {
        title: "Enviornment Options",
        subtitle: "Enviornment or facilities you use",
        icon: House
    },
    {
        title: "You're Ready!",
        subtitle: "Review your selections.",
        icon: Sparkles,
    },
];

const goals = [
    {
        id: "muscle" as const,
        title: "Build Muscle",
        description: "Increase size & aesthetics",
    },
    {
        id: "strength" as const,
        title: "Build Strength",
        description: "Powerlifting focused",
    },
    {
        id: "fat" as const,
        title: "Lose Fat",
        description: "Burn fat efficiently",
    },
    {
        id: "endurance" as const,
        title: "Improve Endurance",
        description: "Cardio & stamina",
    },
];

const levels = [
    "Beginner",
    "Intermediate",
    "Advanced",
] as const;

const weekDays = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
]

const preferredSplits = [
    "Full_Body",
    "Upper_Lower",
    "Push_Pull_Legs",
    "Bro_Split",
] as const;

const enviornmentOptions = [
    "Commercial_Gym",
    "Home_Gym",
    "Bodyweight_Only",
];


export default function Onboarding() {
    const { user, saveProfile, generatePlan } = useAuth();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(0);
    const [goal, setGoal] = useState<"muscle" | "strength" | "fat" | "endurance">("muscle");
    const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
    const [splits, setSplits] = useState<"Full_Body" | "Upper_Lower" | "Push_Pull_Legs" | "Bro_Split">("Full_Body");
    const [enviornment, setEnviornment] = useState("Commercial_Gym")
    const [selectedTime, setSelectedTime] = useState("30 min");
    const [isGenerating, setIsGenerating] = useState(false);


    const [age, setAge] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");

    const [selectedDays, setSelectedDays] = useState("2");
    const [error, setError] = useState("");

    const progress = ((currentStep + 1) / steps.length) * 100;

    const CurrentIcon = steps[currentStep].icon;

    const handleNext = () => {
        if (currentStep === 1) {
            if (!age.trim() || !height.trim() || !weight.trim()) {
                setError("Please enter your age, height, and weight to continue.");
                return;
            }
        }

        setError("");
        setCurrentStep((prev) => prev + 1);
    };

    console.log("oki:", user);

    if (!user) {
        return <RedirectToSignIn />;
    }

    const onSubmit = async () => {
        try {
            const profile: Omit<UserProfile, 'userId' | 'updatedAt'> = {
                goal: goal as UserProfile['goal'],
                levels: level as UserProfile['levels'],
                age: parseInt(age) as UserProfile['age'],
                height: parseInt(height) as UserProfile['height'],
                weight: parseInt(weight) as UserProfile['weight'],
                daysPerWeek: parseInt(selectedDays) as UserProfile['daysPerWeek'],
                splits: splits as UserProfile['splits'],
                enviornment: enviornment as UserProfile['enviornment'],
                sessionLength: parseInt(selectedTime) as UserProfile['sessionLength'],
            }


            await saveProfile(profile);
            setIsGenerating(true);
            await generatePlan();

            navigate("/profile");e
        } catch (err) {
            console.log("Error in submitting the data", err instanceof Error);
        } finally {
            setIsGenerating(false);
        }
    };
    return (
        <SignedIn>
            {isGenerating ? <>
                <div className="flex items-center justify-center min-h-[500px]">
                    <div className="w-full max-w-md rounded-2xl border bg-card shadow-lg p-8 text-center">
                        <div className="flex justify-center mb-6">
                            <div className="rounded-full bg-red-50 p-5">
                                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-foreground">
                            Generating Your Plan
                        </h2>

                        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                            Our AI is building your personalized training program...
                        </p>

                        {/* Animated dots */}
                        <div className="mt-6 flex justify-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full red-gradient animate-bounce [animation-delay:-0.3s]" />
                            <span className="h-2.5 w-2.5 rounded-full red-gradient animate-bounce [animation-delay:-0.15s]" />
                            <span className="h-2.5 w-2.5 rounded-full red-gradient animate-bounce" />
                        </div>

                        <p className="mt-5 text-xs text-muted-foreground">
                            This usually takes a few seconds.
                        </p>
                    </div>
                </div>
            </> : <>
                <div className="flex min-h-screen items-center justify-center p-6">

                    <div className="glass w-full max-w-3xl rounded-3xl p-8">

                        {/* Header */}

                        <div className="mb-8">

                            <div className="mb-3 flex items-center justify-between">

                                <span className="text-sm text-muted">
                                    Step {currentStep + 1} / {steps.length}
                                </span>

                                <span className="text-sm text-muted">
                                    {Math.round(progress)}%
                                </span>

                            </div>

                            <ProgressBar progress={progress} />

                        </div>

                        {/* Title */}

                        <div className="mb-10 text-center">

                            <div className="red-gradient mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl">

                                <CurrentIcon className="text-white" size={30} />

                            </div>

                            <h1 className="mb-2 text-3xl font-bold">
                                {steps[currentStep].title}
                            </h1>

                            <p className="text-muted">
                                {steps[currentStep].subtitle}
                            </p>

                        </div>

                        {/* Content goes here */}

                        <div>
                            <div className="space-y-8">

                                {/* ---------------- Step 1 ---------------- */}

                                {currentStep === 0 && (
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {goals.map((item) => (
                                            <OptionCard
                                                key={item.id}
                                                title={item.title}
                                                description={item.description}
                                                selected={goal === item.id}
                                                onClick={() => setGoal(item.id)}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* ---------------- Step 2 ---------------- */}

                                {currentStep === 1 && (
                                    <div className="space-y-6">

                                        <div>
                                            <h2 className="mb-4 text-lg font-semibold">
                                                Experience Level
                                            </h2>

                                            <div className="grid gap-4">
                                                {levels.map((item) => (
                                                    <OptionCard
                                                        key={item}
                                                        title={item}
                                                        selected={level === item}
                                                        onClick={() => setLevel(item)}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-3">
                                            {error && (
                                                <div className="md:col-span-3 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                                    {error}
                                                </div>
                                            )}

                                            <Input
                                                label="Age"
                                                type="number"
                                                placeholder="20"
                                                value={age}
                                                onChange={(e) => {
                                                    setAge(e.target.value);
                                                    if (error) setError("");
                                                }}
                                                required
                                                min="1"
                                            />

                                            <Input
                                                label="Height (cm)"
                                                type="number"
                                                placeholder="175"
                                                value={height}
                                                onChange={(e) => {
                                                    setHeight(e.target.value);
                                                    if (error) setError("");
                                                }}
                                                required
                                                min="60"
                                            />

                                            <Input
                                                label="Weight (kg)"
                                                type="number"
                                                placeholder="70"
                                                value={weight}
                                                onChange={(e) => {
                                                    setWeight(e.target.value);
                                                    if (error) setError("");
                                                }}
                                                required
                                                min="1"
                                            />

                                        </div>

                                    </div>
                                )}

                                {/* ---------------- Step 3 ---------------- */}

                                {currentStep === 2 && (
                                    <div className="space-y-8">
                                        <div>
                                            <h2 className="mb-4 text-lg font-semibold">
                                                Training Days
                                            </h2>

                                            <div className="flex flex-wrap gap-3">

                                                {weekDays.map((day) => {
                                                    const selected = selectedDays === day;

                                                    return (
                                                        <button
                                                            key={day}
                                                            onClick={() => setSelectedDays(day)}
                                                            className={`glass rounded-xl px-5 py-3 transition ${selected
                                                                ? "border-red-500 bg-red-500/10"
                                                                : "hover:border-red-500"
                                                                }`}
                                                        >
                                                            {selected && (
                                                                <div className="red-gradient flex h-7 w-7 items-center justify-center rounded-full">
                                                                    <Check className="h-4 w-4 text-white" />
                                                                </div>
                                                            )}
                                                            {day}
                                                        </button>
                                                    );
                                                })}

                                            </div>

                                        </div>

                                        <div>

                                            <h2 className="mb-4 text-lg font-semibold">
                                                Workout Duration
                                            </h2>

                                            <div className="grid gap-4 md:grid-cols-4">

                                                {["30 min", "45 min", "60 min", "90 min"].map((time) => (
                                                    <OptionCard
                                                        key={time}
                                                        title={time}
                                                        selected={selectedTime === time}
                                                        onClick={() => setSelectedTime(time)}
                                                    />
                                                ))}

                                            </div>

                                        </div>

                                    </div>
                                )}

                                {currentStep === 3 && (
                                    <div className="space-y-8">
                                        <div>
                                            <h2 className="mb-4 text-lg font-semibold">
                                                Workout Splits
                                            </h2>

                                            <div className="grid gap-4">
                                                {preferredSplits.map((item) => (
                                                    <OptionCard
                                                        key={item}
                                                        title={item}
                                                        selected={splits === item}
                                                        onClick={() => setSplits(item)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 4 && (
                                    <div className="space-y-8">
                                        <div>
                                            <h2 className="mb-4 text-lg font-semibold">
                                                Enviornment
                                            </h2>

                                            <div className="grid gap-4">
                                                {enviornmentOptions.map((item) => (
                                                    <OptionCard
                                                        key={item}
                                                        title={item}
                                                        selected={enviornment === item}
                                                        onClick={() => setEnviornment(item)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ---------------- Step 4 ---------------- */}
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    onSubmit();
                                }} className="space-y-4">
                                    {currentStep === 5 && (
                                        <div className="space-y-4">
                                            <div className="glass rounded-xl p-4 flex justify-between">
                                                <span className="text-muted">Goal</span>
                                                <span>{goals.find((g) => g.id === goal)?.title}</span>
                                            </div>
                                            <div className="glass rounded-xl p-4 flex justify-between">
                                                <span className="text-muted">Experience</span>
                                                <span>{level}</span>
                                            </div>
                                            <div className="glass rounded-xl p-4 flex justify-between">
                                                <span className="text-muted">Age</span>
                                                <span>{age}</span>
                                            </div>
                                            <div className="glass rounded-xl p-4 flex justify-between">
                                                <span className="text-muted">Height</span>
                                                <span>{height} cm</span>
                                            </div>
                                            <div className="glass rounded-xl p-4 flex justify-between">
                                                <span className="text-muted">Weight</span>
                                                <span>{weight} kg</span>
                                            </div>
                                            <div className="glass rounded-xl p-4 flex justify-between">
                                                <span className="text-muted">Workout Days</span>
                                                <span>{selectedDays}</span>
                                            </div>
                                            <div className="glass rounded-xl p-4 flex justify-between">
                                                <span className="text-muted">Session</span>
                                                <span>{selectedTime}</span>
                                            </div>
                                            <div className="glass rounded-xl p-4 flex justify-between">
                                                <span className="text-muted">Splits</span>
                                                <span>{splits}</span>
                                            </div>
                                            <div className="glass rounded-xl p-4 flex justify-between">
                                                <span className="text-muted">Enviornment</span>
                                                <span>{enviornment}</span>
                                            </div>

                                        </div>
                                    )}

                                    {/* ---------------- Navigation ---------------- */}

                                    <div className="flex justify-between pt-4">

                                        <Button
                                            variant="outline"
                                            type="button"
                                            onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
                                        >
                                            Back
                                        </Button>

                                        {currentStep < steps.length - 1 ? (
                                            <Button
                                                type="button"
                                                onClick={handleNext}
                                            >
                                                Continue
                                            </Button>
                                        ) : (
                                            <Button type="submit">
                                                Finish
                                            </Button>
                                        )}

                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </>}
        </SignedIn>
    );
}

