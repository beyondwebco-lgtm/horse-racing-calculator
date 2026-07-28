import { getClients, createClientAction, updateClientStatus } from '@/app/actions/clients'
import { revalidatePath } from 'next/cache'

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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Mobile</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Opening Bal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Current Bal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {clients.map(client => (
              <tr key={client.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{client.client_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{client.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{client.mobile_number}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${client.opening_balance.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-bold">${client.current_balance.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  <form action={async () => {
                    'use server';
                    await updateClientStatus(client.id, client.status === 'Active' ? 'Inactive' : 'Active');
                  }}>
                    <button type="submit" className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${client.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {client.status}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
