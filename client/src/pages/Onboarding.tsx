import { RedirectToSignIn, SignedIn } from "@neondatabase/neon-js/auth/react";
import { useAuth } from "../context/AuthContext";
import { Target, Dumbbell, Calendar, Sparkles, Check, Split, House } from "lucide-react";
import Button from "../components/ui/Button";
import ProgressBar from "../components/ui/ProgressBar";
import OptionCard from "../components/ui/OptionCard";
import { useState } from "react";
import Input from "../components/ui/Input";
import { useNavigate } from "react-router-dom";


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
        id: "muscle",
        title: "Build Muscle",
        description: "Increase size & aesthetics",
    },
    {
        id: "strength",
        title: "Build Strength",
        description: "Powerlifting focused",
    },
    {
        id: "fat",
        title: "Lose Fat",
        description: "Burn fat efficiently",
    },
    {
        id: "endurance",
        title: "Improve Endurance",
        description: "Cardio & stamina",
    },
];

const levels = [
    "Beginner",
    "Intermediate",
    "Advanced",
];

const weekDays = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
];

const preferredSplits = [
    "Full Body",
    "Upper/Lower",
    "Push/Pull/Legs",
    "Bro Split",
];

const enviornmentOptions = [
    "Commercial Gym",
    "Home Gym",
    "Bodyweight Only",
];


export default function Onboarding() {
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(0);
    const [goal, setGoal] = useState("muscle");
    const [level, setLevel] = useState("Intermediate");
    const [splits, setSplits] = useState("Full Body");
    const [enviornment, setEnviornment] = useState("Commercial Gym")
    const [selectedTime, setSelectedTime] = useState("30 min");


    const [age, setAge] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");

    const [selectedDays, setSelectedDays] = useState([
        "Mon",
        "Wed",
        "Fri",
    ]);

    const progress = ((currentStep + 1) / steps.length) * 100;

    const CurrentIcon = steps[currentStep].icon;

    const { user } = useAuth();
    console.log("oki:", user);

    if (!user) {
        return <RedirectToSignIn />;
    }

    const onSubmit = () => {
        const data = {
            goal: goals.find((g) => g.id === goal)?.title,
            level,
            age,
            height,
            weight,
            selectedDays,
            selectedTime,
            preferredSplits,
            enviornmentOptions
        };

        console.log("Form submitted:", data);

        if (typeof window !== "undefined") {
            window.localStorage.setItem("onboardingCompleted", "true");
        }

        navigate("/profile", { replace: true });
    };
    return (
        <SignedIn>
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

                                        <Input
                                            label="Age"
                                            type="number"
                                            placeholder="20"
                                            value={age}
                                            onChange={(e) => setAge(e.target.value)}
                                        />

                                        <Input
                                            label="Height (cm)"
                                            type="number"
                                            placeholder="175"
                                            value={height}
                                            onChange={(e) => setHeight(e.target.value)}
                                        />

                                        <Input
                                            label="Weight (kg)"
                                            type="number"
                                            placeholder="70"
                                            value={weight}
                                            onChange={(e) => setWeight(e.target.value)}
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

                                                const selected = selectedDays.includes(day);

                                                return (
                                                    <button
                                                        key={day}
                                                        onClick={() =>
                                                            setSelectedDays((prev) =>
                                                                selected
                                                                    ? prev.filter((d) => d !== day)
                                                                    : [...prev, day]
                                                            )
                                                        }
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
                                            <span>{selectedDays.join(", ")}</span>
                                        </div>
                                        <div className="glass rounded-xl p-4 flex justify-between">
                                            <span className="text-muted">Session</span>
                                            <span>{selectedTime}</span>
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
                                            onClick={() => setCurrentStep((prev) => prev + 1)}
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
        </SignedIn>
    );
}