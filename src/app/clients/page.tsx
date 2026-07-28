import { getClients, createClientAction } from '@/app/actions/clients'
import ClientList from './ClientList'

export default async function ClientsPage() {
  const clients = await getClients()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Client Master</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Add New Client</h2>
        <form action={async (formData) => {
          'use server';
          await createClientAction(formData);
        }} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Name</label>
            <input type="text" name="name" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Mobile Number</label>
            <input type="text" name="mobile_number" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Opening Balance</label>
            <input type="number" step="0.01" name="opening_balance" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border" />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800">Add Client</button>
          </div>
        </form>
      </div>

      <ClientList initialClients={clients} />
    </div>
  )
}
