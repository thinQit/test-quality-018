'use client';

import { useEffect, useMemo, useState } from 'react';
import Button from '@/components/ui/Button';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/providers/ToastProvider';

interface ContactSubmission {
  id?: string;
  name?: string;
  email?: string;
  message?: string;
  status?: string;
  createdAt?: string;
}

interface ContactListResponse {
  items: ContactSubmission[];
  total: number;
  page: number;
  limit: number;
}

export function DashboardPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<ContactSubmission | null>(null);

  const limit = 10;
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  const fetchContacts = async () => {
    setLoading(true);
    setError('');
    const { data, error: apiError } = await api.get<ContactListResponse>(
      `/api/contacts?page=${page}&limit=${limit}`
    );
    setLoading(false);

    if (apiError || !data) {
      setError(apiError || 'Failed to load submissions.');
      return;
    }

    setContacts(data.items);
    setTotal(data.total);
  };

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchContacts();
    }
  }, [page, authLoading, isAuthenticated]);

  const handleDelete = async (id?: string) => {
    if (!id) return;
    const { data, error: apiError } = await api.delete<{ success: boolean }>(`/api/contacts/${id}`);
    if (apiError || !data?.success) {
      toast(apiError || 'Delete failed', 'error');
      return;
    }
    toast('Submission deleted', 'success');
    fetchContacts();
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-16">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-semibold">Admin access required</h1>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-secondary">
              Please sign in with an admin account to view contact submissions.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Contact submissions</h1>
        <p className="text-sm text-secondary">Manage incoming leads and follow up with prospects.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">All submissions</h2>
              <p className="text-sm text-secondary">
                {total} total • Page {page} of {totalPages}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                disabled={page === 1 || loading}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                disabled={page === totalPages || loading}
              >
                Next
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="h-8 w-8" />
            </div>
          ) : error ? (
            <div className="rounded-md border border-error/20 bg-error/10 p-4 text-sm text-error">
              {error}
            </div>
          ) : contacts.length === 0 ? (
            <div className="py-12 text-center text-sm text-secondary">
              No submissions yet. Check back soon.
            </div>
          ) : (
            <div className="space-y-4">
              {contacts.map(item => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-lg border border-border p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold">{item.name || 'Unknown'}</h3>
                      <Badge variant={item.status === 'read' ? 'secondary' : 'success'}>
                        {item.status || 'new'}
                      </Badge>
                    </div>
                    <p className="text-sm text-secondary">{item.email || 'No email provided'}</p>
                    <p className="text-sm text-secondary">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'} • {' '}
                      {item.message ? `${item.message.slice(0, 120)}${item.message.length > 120 ? '...' : ''}` : 'No message'}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelected(item)}>
                      View
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      aria-label={`Delete submission from ${item.name || 'contact'}`}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name || 'Submission details'}
      >
        {selected ? (
          <div className="space-y-4 text-sm text-secondary">
            <div>
              <p className="text-xs uppercase tracking-wide text-secondary">Email</p>
              <p className="text-base text-foreground">{selected.email || 'No email provided'}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-secondary">Submitted</p>
              <p className="text-base text-foreground">
                {selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-secondary">Message</p>
              <p className="whitespace-pre-line text-base text-foreground">
                {selected.message || 'No message provided'}
              </p>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

export default DashboardPage;
