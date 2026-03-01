import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload, FileText, CheckCircle2, ArrowRight, ArrowLeft, Building2, CreditCard, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Logo } from '@/components/common/Logo'
import { technicianKycSchema, type TechnicianKycFormData } from '@/schemas/profile.schema'
import { cn } from '@/utils/cn'

const steps = ['Personal', 'Documents', 'Bank Details', 'Review']
const skillOptions = ['Plumber', 'Electrician', 'AC Technician', 'Carpenter', 'Painter', 'Appliance Repair']

export default function TechRegistrationPage() {
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(0)
    const [selectedSkills, setSelectedSkills] = useState<string[]>([])

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TechnicianKycFormData>({
        resolver: zodResolver(technicianKycSchema),
    })

    const toggleSkill = (skill: string) => {
        setSelectedSkills((prev) =>
            prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
        )
    }

    const onSubmit = async (_data: TechnicianKycFormData) => {
        navigate('/technician')
    }

    const handleNext = () => {
        if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1)
    }
    const handleBack = () => {
        if (currentStep > 0) setCurrentStep((s) => s - 1)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
            <div className="w-full max-w-2xl animate-fade-in">
                <div className="mb-8 text-center">
                    <div className="mb-4 flex justify-center"><Logo size="lg" /></div>
                    <h1 className="text-2xl font-bold">Become a FixMyHome Pro Technician</h1>
                    <p className="mt-1 text-muted-foreground">Complete your KYC to start receiving jobs</p>
                </div>

                {/* Stepper */}
                <div className="mb-8 flex items-center gap-2">
                    {steps.map((step, i) => (
                        <div key={step} className="flex flex-1 items-center gap-2">
                            <div className={cn(
                                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                                i < currentStep ? 'bg-emerald-500 text-white' :
                                    i === currentStep ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                            )}>
                                {i < currentStep ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                            </div>
                            <span className={cn('hidden text-xs font-medium sm:block', i === currentStep ? 'text-foreground' : 'text-muted-foreground')}>{step}</span>
                            {i < steps.length - 1 && <div className={cn('h-0.5 flex-1', i < currentStep ? 'bg-emerald-500' : 'bg-muted')} />}
                        </div>
                    ))}
                </div>

                <Card className="border-0 shadow-elevated">
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* Step 1: Personal */}
                            {currentStep === 0 && (
                                <div className="space-y-4">
                                    <CardHeader className="p-0">
                                        <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Personal Details</CardTitle>
                                        <CardDescription>Tell us about yourself</CardDescription>
                                    </CardHeader>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label>Full Name</Label>
                                            <Input {...(register as any)('full_name')} placeholder="Your full name" />
                                            {(errors as any).full_name && <p className="text-sm text-destructive">{(errors as any).full_name.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Phone</Label>
                                            <Input {...(register as any)('phone')} placeholder="Phone number" maxLength={10} />
                                            {(errors as any).phone && <p className="text-sm text-destructive">{(errors as any).phone.message}</p>}
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                            <Label>Email (optional)</Label>
                                            <Input {...(register as any)('email')} type="email" placeholder="your@email.com" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Skills / Services</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {skillOptions.map((skill) => (
                                                <button
                                                    key={skill}
                                                    type="button"
                                                    onClick={() => toggleSkill(skill)}
                                                    className={cn(
                                                        'rounded-full border px-4 py-1.5 text-sm font-medium transition-all',
                                                        selectedSkills.includes(skill)
                                                            ? 'border-primary bg-primary/10 text-primary'
                                                            : 'border-border hover:border-primary/30'
                                                    )}
                                                >
                                                    {skill}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Documents */}
                            {currentStep === 1 && (
                                <div className="space-y-4">
                                    <CardHeader className="p-0">
                                        <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Identity Documents</CardTitle>
                                        <CardDescription>Upload your Aadhar & PAN for verification</CardDescription>
                                    </CardHeader>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label>Aadhar Number</Label>
                                            <Input {...register('aadhar_number')} placeholder="XXXX XXXX XXXX" maxLength={14} />
                                            {errors.aadhar_number && <p className="text-sm text-destructive">{errors.aadhar_number.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label>PAN Number</Label>
                                            <Input {...register('pan_number')} placeholder="ABCDE1234F" maxLength={10} />
                                            {errors.pan_number && <p className="text-sm text-destructive">{errors.pan_number.message}</p>}
                                        </div>
                                    </div>

                                    {['Aadhar Front', 'Aadhar Back', 'PAN Card'].map((doc) => (
                                        <div key={doc} className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-6 text-center transition-colors hover:border-primary/30">
                                            <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                                            <p className="text-sm font-medium">{doc}</p>
                                            <p className="text-xs text-muted-foreground">Click to upload or drag and drop (JPG, PNG, PDF)</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Step 3: Bank Details */}
                            {currentStep === 2 && (
                                <div className="space-y-4">
                                    <CardHeader className="p-0">
                                        <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5 text-primary" /> Bank Details</CardTitle>
                                        <CardDescription>For receiving payouts</CardDescription>
                                    </CardHeader>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Account Holder Name</Label>
                                            <Input {...register('bank_account_holder_name')} placeholder="Name as per bank account" />
                                            {errors.bank_account_holder_name && <p className="text-sm text-destructive">{errors.bank_account_holder_name.message}</p>}
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label>Account Number</Label>
                                                <Input {...register('bank_account_number')} placeholder="Account number" />
                                                {errors.bank_account_number && <p className="text-sm text-destructive">{errors.bank_account_number.message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label>IFSC Code</Label>
                                                <Input {...register('bank_ifsc_code')} placeholder="e.g. SBIN0001234" />
                                                {errors.bank_ifsc_code && <p className="text-sm text-destructive">{errors.bank_ifsc_code.message}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Review */}
                            {currentStep === 3 && (
                                <div className="space-y-4">
                                    <CardHeader className="p-0">
                                        <CardTitle className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-500" /> Review & Submit</CardTitle>
                                        <CardDescription>Please review your details before submitting</CardDescription>
                                    </CardHeader>

                                    <div className="space-y-3 rounded-xl bg-muted/50 p-5">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Skills</span>
                                            <span className="font-medium">{selectedSkills.join(', ') || 'None selected'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Documents</span>
                                            <span className="font-medium">Aadhar + PAN uploaded</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Bank Details</span>
                                            <span className="font-medium">Provided</span>
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 p-4">
                                        <p className="text-sm text-amber-800 dark:text-amber-200">
                                            <strong>Note:</strong> Your application will be reviewed within 24-48 hours. You'll receive an OTP notification once approved.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </form>
                    </CardContent>
                </Card>

                {/* Navigation */}
                <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={handleBack} disabled={currentStep === 0} className="gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                    {currentStep === steps.length - 1 ? (
                        <Button onClick={handleSubmit(onSubmit)} className="gap-2">
                            Submit Application <CreditCard className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button onClick={handleNext} className="gap-2">
                            Next <ArrowRight className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
