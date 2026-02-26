'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import { api } from '@/lib/api';
import { useToast } from '@/providers/ToastProvider';

interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

interface ContactResponse {
  id: string;
  createdAt: string;
  status: 'new';
}

const initialValues: ContactFormValues = { name: '', email: '', message: '' };

export function HomePage() {
  const { toast } = useToast();
  const [values, setValues] = useState<ContactFormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<ContactFormValues>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  const validate = () => {
    const nextErrors: Partial<ContactFormValues> = {};
    if (!values.name.trim()) nextErrors.name = 'Name is required.';
    if (!values.email.trim()) nextErrors.email = 'Email is required.';
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      nextErrors.email = 'Enter a valid email.';
    }
    if (!values.message.trim()) nextErrors.message = 'Message is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (field: keyof ContactFormValues, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError('');
    setSuccessMessage('');
    if (!validate()) return;

    setSubmitting(true);
    const { data, error } = await api.post<ContactResponse>('/api/contacts', values);
    setSubmitting(false);

    if (error || !data) {
      setSubmitError(error || 'Something went wrong.');
      toast(error || 'Submission failed', 'error');
      return;
    }

    setSuccessMessage('Thanks! We received your message and will respond soon.');
    toast('Message sent successfully', 'success');
    setValues(initialValues);
  };

  return (
    <div className="bg-background">
      <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-4 py-16 md:flex-row md:gap-16">
        <div className="flex-1 space-y-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Launch faster</p>
          <h1 className="text-4xl font-bold leading-tight text-foreground md:text-5xl">
            Grow your business with a modern landing page.
          </h1>
          <p className="text-lg text-secondary">
            We help teams capture qualified leads with a polished, responsive site and a contact workflow that just works.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#contact" className="w-full sm:w-auto" aria-label="Jump to contact form">
              <Button size="lg" fullWidth>
                Get in touch
              </Button>
            </a>
            <div className="flex items-center gap-3 text-sm text-secondary">
              <span className="inline-flex h-2 w-2 rounded-full bg-success" />
              <span>Trusted by growing teams worldwide</span>
            </div>
          </div>
        </div>
        <Card className="w-full max-w-md">
          <CardHeader>
            <h2 className="text-xl font-semibold">Send us a message</h2>
            <p className="text-sm text-secondary">Tell us about your project and we will follow up.</p>
          </CardHeader>
          <CardContent>
            <form id="contact" className="space-y-4" onSubmit={handleSubmit} noValidate>
              <Input
                label="Name"
                name="name"
                value={values.name}
                onChange={event => handleChange('name', event.target.value)}
                error={errors.name}
                placeholder="Jane Doe"
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={event => handleChange('email', event.target.value)}
                error={errors.email}
                placeholder="jane@company.com"
              />
              <div className="space-y-1">
                <label htmlFor="message" className="block text-sm font-medium text-foreground">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={values.message}
                  onChange={event => handleChange('message', event.target.value)}
                  className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.message ? 'border-error' : 'border-border'
                  }`}
                  placeholder="Share a few details about your goals."
                />
                {errors.message && <p className="text-sm text-error">{errors.message}</p>}
              </div>
              {submitError && <p className="text-sm text-error">{submitError}</p>}
              {successMessage && <p className="text-sm text-success">{successMessage}</p>}
              <Button type="submit" size="lg" fullWidth loading={submitting} aria-label="Submit contact form">
                {submitting ? 'Sending...' : 'Send message'}
              </Button>
            </form>
            {submitting && (
              <div className="mt-4 flex items-center gap-2 text-sm text-secondary">
                <Spinner className="h-4 w-4" />
                Sending your message...
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="bg-muted">
        <div className="mx-auto w-full max-w-6xl px-4 py-12">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { title: 'Responsive design', body: 'Layouts that look great on any device, built with Tailwind CSS.' },
              { title: 'Lead capture', body: 'Collect inquiries with a clean form and instant feedback.' },
              { title: 'Admin visibility', body: 'Review submissions in a streamlined dashboard.' }
            ].map(item => (
              <Card key={item.title} className="h-full">
                <CardContent className="space-y-2">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-secondary">{item.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
