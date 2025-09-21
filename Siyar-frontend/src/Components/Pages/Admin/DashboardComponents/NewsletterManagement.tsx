import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
	useGetAllSubscriptionsQuery, 
	useGetNewsletterStatsQuery,
	useUnsubscribeFromNewsletterMutation,
	type NewsletterSubscription 
} from '../../../../Redux/api/newsletterApi';

const NewsletterManagement: React.FC = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [statusFilter, setStatusFilter] = useState<string>('');
	const [searchEmail, setSearchEmail] = useState('');
	const limit = 10;

	// API hooks
	const { data: statsData, isLoading: statsLoading } = useGetNewsletterStatsQuery();
	const { data: subscriptionsData, isLoading: subscriptionsLoading, refetch } = useGetAllSubscriptionsQuery({
		page: currentPage,
		limit,
		status: statusFilter || undefined
	});
	const [unsubscribeFromNewsletter, { isLoading: unsubscribeLoading }] = useUnsubscribeFromNewsletterMutation();

	const stats = statsData?.data;
	const subscriptions = subscriptionsData?.data;

	// Handle unsubscribe
	const handleUnsubscribe = async (email: string) => {
		if (window.confirm(`Are you sure you want to unsubscribe ${email}?`)) {
			try {
				await unsubscribeFromNewsletter({ email }).unwrap();
				refetch(); // Refresh the data
				alert('Successfully unsubscribed user');
			} catch (error: any) {
				console.error('Unsubscribe error:', error);
				alert(error?.data?.message || 'Failed to unsubscribe user');
			}
		}
	};

	// Filter subscriptions by email search
	const filteredSubscriptions = subscriptions?.subscriptions?.filter(sub => 
		searchEmail === '' || sub.email.toLowerCase().includes(searchEmail.toLowerCase())
	) || [];

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	const getStatusBadge = (status: string) => {
		const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
		switch (status) {
			case 'active':
				return `${baseClasses} bg-green-100 text-green-800`;
			case 'unsubscribed':
				return `${baseClasses} bg-red-100 text-red-800`;
			case 'pending':
				return `${baseClasses} bg-yellow-100 text-yellow-800`;
			default:
				return `${baseClasses} bg-gray-100 text-gray-800`;
		}
	};

	return (
		<div className="p-6 bg-white rounded-lg shadow-sm">
			<div className="mb-6">
				<h2 className="text-2xl font-bold text-gray-900 mb-2">Newsletter Management</h2>
				<p className="text-gray-600">Manage newsletter subscriptions and view statistics</p>
			</div>

			{/* Statistics Cards */}
			{statsLoading ? (
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
					{[...Array(4)].map((_, i) => (
						<div key={i} className="bg-gray-200 animate-pulse h-24 rounded-lg"></div>
					))}
				</div>
			) : (
				<motion.div 
					className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
						<div className="text-2xl font-bold text-blue-600">{stats?.total || 0}</div>
						<div className="text-sm text-blue-800">Total Subscribers</div>
					</div>
					<div className="bg-green-50 p-4 rounded-lg border border-green-200">
						<div className="text-2xl font-bold text-green-600">{stats?.active || 0}</div>
						<div className="text-sm text-green-800">Active</div>
					</div>
					<div className="bg-red-50 p-4 rounded-lg border border-red-200">
						<div className="text-2xl font-bold text-red-600">{stats?.unsubscribed || 0}</div>
						<div className="text-sm text-red-800">Unsubscribed</div>
					</div>
					<div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
						<div className="text-2xl font-bold text-yellow-600">{stats?.pending || 0}</div>
						<div className="text-sm text-yellow-800">Pending</div>
					</div>
				</motion.div>
			)}

			{/* Filters */}
			<div className="mb-6 flex flex-col sm:flex-row gap-4">
				<div className="flex-1">
					<input
						type="text"
						placeholder="Search by email..."
						value={searchEmail}
						onChange={(e) => setSearchEmail(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<select
					value={statusFilter}
					onChange={(e) => setStatusFilter(e.target.value)}
					className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="">All Status</option>
					<option value="active">Active</option>
					<option value="unsubscribed">Unsubscribed</option>
					<option value="pending">Pending</option>
				</select>
			</div>

			{/* Subscriptions Table */}
			<div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
				{subscriptionsLoading ? (
					<div className="p-8 text-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
						<p className="mt-2 text-gray-600">Loading subscriptions...</p>
					</div>
				) : (
					<>
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Email
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Name
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Status
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Subscribed
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Source
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{filteredSubscriptions.length === 0 ? (
										<tr>
											<td colSpan={6} className="px-6 py-4 text-center text-gray-500">
												No subscriptions found
											</td>
										</tr>
									) : (
										filteredSubscriptions.map((subscription: NewsletterSubscription) => (
											<tr key={subscription._id} className="hover:bg-gray-50">
												<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
													{subscription.email}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													{subscription.firstName} {subscription.lastName}
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span className={getStatusBadge(subscription.status)}>
														{subscription.status}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													{formatDate(subscription.subscribedAt)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													{subscription.metadata?.source || 'N/A'}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
													{subscription.status === 'active' && (
														<button
															onClick={() => handleUnsubscribe(subscription.email)}
															disabled={unsubscribeLoading}
															className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
														>
															{unsubscribeLoading ? 'Unsubscribing...' : 'Unsubscribe'}
														</button>
													)}
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>

						{/* Pagination */}
						{subscriptions && subscriptions.totalPages > 1 && (
							<div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
								<div className="flex-1 flex justify-between sm:hidden">
									<button
										onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
										disabled={currentPage === 1}
										className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										Previous
									</button>
									<button
										onClick={() => setCurrentPage(Math.min(subscriptions.totalPages, currentPage + 1))}
										disabled={currentPage === subscriptions.totalPages}
										className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										Next
									</button>
								</div>
								<div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
									<div>
										<p className="text-sm text-gray-700">
											Showing{' '}
											<span className="font-medium">{(currentPage - 1) * limit + 1}</span>
											{' '}to{' '}
											<span className="font-medium">
												{Math.min(currentPage * limit, subscriptions.total)}
											</span>
											{' '}of{' '}
											<span className="font-medium">{subscriptions.total}</span>
											{' '}results
										</p>
									</div>
									<div>
										<nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
											<button
												onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
												disabled={currentPage === 1}
												className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
											>
												Previous
											</button>
											{/* Page numbers */}
											{[...Array(Math.min(5, subscriptions.totalPages))].map((_, i) => {
												const pageNum = Math.max(1, Math.min(subscriptions.totalPages - 4, currentPage - 2)) + i;
												if (pageNum > subscriptions.totalPages) return null;
												
												return (
													<button
														key={pageNum}
														onClick={() => setCurrentPage(pageNum)}
														className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
															pageNum === currentPage
																? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
																: 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
														}`}
													>
														{pageNum}
													</button>
												);
											})}
											<button
												onClick={() => setCurrentPage(Math.min(subscriptions.totalPages, currentPage + 1))}
												disabled={currentPage === subscriptions.totalPages}
												className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
											>
												Next
											</button>
										</nav>
									</div>
								</div>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default NewsletterManagement;
