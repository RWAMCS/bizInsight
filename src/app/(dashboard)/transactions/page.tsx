import { getTransactions } from '@/services/transactionService'
import { getActiveBusinessId } from '@/app/auth/business-actions'
import { redirect } from 'next/navigation'
import TransactionsClient from './transactions-client'

export default async function TransactionsPage() {
  const activeBusinessId = await getActiveBusinessId()

  if (!activeBusinessId) {
    redirect('/dashboard')
  }

  const transactions = await getTransactions(activeBusinessId)

  return <TransactionsClient transactions={transactions} />
}