import React, { useState } from 'react';
import { useGetArticlesQuery, useDeleteArticleMutation, useUpdateArticleMutation } from '../../../../Redux/api/articleApi';
import { useGetCategoriesQuery } from '../../../../Redux/api/categoryApi';
import { useGetSeriesQuery } from '../../../../Redux/api/seriesApi';
import type { IArticle, ArticleStatus, SupportedLanguage } from '../../../../Redux/api/articleApi';
import { FaEdit, FaTrash, FaEye, FaStar, FaGlobe } from 'react-icons/fa';
import CreateArticleModal from './CreateArticleModal';
import ArticleModal from './ArticleModal';
import ViewArticleModal from './ViewArticleModal';
import Swal from 'sweetalert2';

// Helper to safely extract an error message without using any
function extractErrorMessage(error: unknown, fallback: string): string {
	if (typeof error === 'string') return error;
	if (error && typeof error === 'object') {
		// RTK Query style: { data?: { message?: string } }
		const maybeData = (error as { data?: unknown }).data;
		if (maybeData && typeof maybeData === 'object' && 'message' in maybeData) {
			const msg = (maybeData as { message?: unknown }).message;
			if (typeof msg === 'string') return msg;
		}
		// Generic Error-like: { message?: string }
		if ('message' in error) {
			const msg = (error as { message?: unknown }).message;
			if (typeof msg === 'string') return msg;
		}
	}
	return fallback;
}

const ArticleManagement: React.FC = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState<ArticleStatus | ''>('');
	const [languageFilter, setLanguageFilter] = useState<SupportedLanguage | ''>('');
	const [categoryFilter, setCategoryFilter] = useState<string>('');
	const [seriesFilter, setSeriesFilter] = useState<string>('');
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	const [selectedArticle, setSelectedArticle] = useState<IArticle | undefined>(undefined);

	// Fetch articles from API
	const { data: articlesResponse, isLoading, error } = useGetArticlesQuery({
		page: currentPage,
		limit: 20,
		...(statusFilter && { status: statusFilter }),
		...(languageFilter && { language: languageFilter }),
		...(categoryFilter && { category: categoryFilter }),
		...(seriesFilter && { series: seriesFilter }),
	});

	// Fetch categories and series for filters
	const { data: categoriesResponse } = useGetCategoriesQuery({});
	const { data: seriesResponse } = useGetSeriesQuery({});

	const [deleteArticle] = useDeleteArticleMutation();
	const [updateArticle] = useUpdateArticleMutation();

	const articles = articlesResponse?.data?.items || [];
	const totalArticles = articlesResponse?.data?.total || 0;
	const totalPages = Math.ceil(totalArticles / 20);

	// Filter articles based on search term
	const filteredArticles = articles.filter((article) => {
		if (!searchTerm) return true;
		const searchLower = searchTerm.toLowerCase();
		return (
			article.title.toLowerCase().includes(searchLower) ||
			article.subtitle?.toLowerCase().includes(searchLower) ||
			article.author.toLowerCase().includes(searchLower) ||
			article.slug.toLowerCase().includes(searchLower)
		);
	});



	const getLanguageLabel = (language: SupportedLanguage) => {
		const labels = {
			en: 'English',
			ar: 'Arabic',
			id: 'Indonesian',
			tr: 'Turkish'
		};
		return labels[language];
	};

	const handleDeleteArticle = async (id: string) => {
		// Show confirmation dialog with Swal
		const result = await Swal.fire({
			title: 'Are you sure?',
			text: 'Do you want to delete this article? This action cannot be undone.',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#d33',
			cancelButtonColor: '#3085d6',
			confirmButtonText: 'Yes, delete it!',
			cancelButtonText: 'Cancel'
		});

		if (result.isConfirmed) {
			try {
				const response = await deleteArticle(id).unwrap();
				
				if (response.success) {
					// Show success message
					await Swal.fire({
						icon: 'success',
						title: 'Deleted!',
						text: 'Article has been deleted successfully.',
						timer: 2000,
						showConfirmButton: false
					});
				} else {
					throw new Error(response.message || 'Failed to delete article');
				}
			} catch (error: unknown) {
				console.error('Failed to delete article:', error);
				
				// Show error message
				const errorMessage = extractErrorMessage(error, 'Failed to delete article. Please try again.');
				
				Swal.fire({
					icon: 'error',
					title: 'Error!',
					text: errorMessage,
					confirmButtonText: 'OK'
				});
			}
		}
	};

	const handleToggleFeatured = async (article: IArticle) => {
		try {
			const response = await updateArticle({
				id: article._id,
				data: { isFeatured: !article.isFeatured }
			}).unwrap();
			
			if (response.success) {
				// Show success message
				await Swal.fire({
					icon: 'success',
					title: 'Updated!',
					text: `Article ${!article.isFeatured ? 'marked as' : 'removed from'} featured successfully.`,
					timer: 2000,
					showConfirmButton: false
				});
			} else {
				throw new Error(response.message || 'Failed to update article');
			}
		} catch (error: unknown) {
			console.error('Failed to update article:', error);
			
			// Show error message
			const errorMessage = extractErrorMessage(error, 'Failed to update article featured status. Please try again.');
					  
			Swal.fire({
				icon: 'error',
				title: 'Error!',
				text: errorMessage,
				confirmButtonText: 'OK'
			});
		}
	};

	const handleToggleLatest = async (article: IArticle) => {
		try {
			const response = await updateArticle({
				id: article._id,
				data: { isLatest: !article.isLatest }
			}).unwrap();
			
			if (response.success) {
				// Show success message
				await Swal.fire({
					icon: 'success',
					title: 'Updated!',
					text: `Article ${!article.isLatest ? 'marked as' : 'removed from'} latest successfully.`,
					timer: 2000,
					showConfirmButton: false
				});
			} else {
				throw new Error(response.message || 'Failed to update article');
			}
		} catch (error: unknown) {
			console.error('Failed to update article:', error);
			
			// Show error message
			const errorMessage = extractErrorMessage(error, 'Failed to update article latest status. Please try again.');
					  
			Swal.fire({
				icon: 'error',
				title: 'Error!',
				text: errorMessage,
				confirmButtonText: 'OK'
			});
		}
	};

	const handleStatusChange = async (article: IArticle, newStatus: ArticleStatus) => {
		try {
			const response = await updateArticle({
				id: article._id,
				data: { status: newStatus }
			}).unwrap();
			
			if (response.success) {
				// Show success message
				await Swal.fire({
					icon: 'success',
					title: 'Updated!',
					text: `Article status changed to ${newStatus} successfully.`,
					timer: 2000,
					showConfirmButton: false
				});
			} else {
				throw new Error(response.message || 'Failed to update article');
			}
		} catch (error: unknown) {
			console.error('Failed to update article status:', error);
			
			// Show error message
			const errorMessage = extractErrorMessage(error, 'Failed to update article status. Please try again.');
					  
			Swal.fire({
				icon: 'error',
				title: 'Error!',
				text: errorMessage,
				confirmButtonText: 'OK'
			});
		}
	};

	return (
		<div className="space-y-4 lg:space-y-6">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<h2 className="text-xl lg:text-2xl font-bold">Article Management</h2>
				<button 
					className="btn btn-primary btn-sm lg:btn-md w-full sm:w-auto"
					onClick={() => setIsCreateModalOpen(true)}
				>
					<span>📝</span>
					Create New Article
				</button>
			</div>
			
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4">
				<div className="stat bg-base-100 p-2 lg:p-4 rounded-lg text-center border">
					<div className="stat-title text-xs lg:text-sm">Total Articles</div>
					<div className="stat-value text-primary text-lg lg:text-2xl">{totalArticles}</div>
				</div>
				<div className="stat bg-base-100 p-2 lg:p-4 rounded-lg text-center border">
					<div className="stat-title text-xs lg:text-sm">Published</div>
					<div className="stat-value text-success text-lg lg:text-2xl">{articles.filter(a => a.status === 'published').length}</div>
				</div>
				<div className="stat bg-base-100 p-2 lg:p-4 rounded-lg text-center border">
					<div className="stat-title text-xs lg:text-sm">Drafts</div>
					<div className="stat-value text-warning text-lg lg:text-2xl">{articles.filter(a => a.status === 'draft').length}</div>
				</div>
				<div className="stat bg-base-100 p-2 lg:p-4 rounded-lg text-center border">
					<div className="stat-title text-xs lg:text-sm">Featured</div>
					<div className="stat-value text-secondary text-lg lg:text-2xl">{articles.filter(a => a.isFeatured).length}</div>
				</div>
			</div>
			
			<div className="card bg-base-100 shadow-lg">
				<div className="card-body p-3 lg:p-6">
					<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
							<h3 className="text-base lg:text-lg font-semibold">
								All Articles ({filteredArticles.length} of {articles.length})
							</h3>
							<div className="flex flex-col sm:flex-row gap-2 lg:gap-3 w-full lg:w-auto">
									<input
										type="text"
										placeholder="Search articles..."
										className="input input-bordered input-sm w-full sm:w-auto"
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										onKeyPress={(e) => {
											if (e.key === 'Enter') {
												e.preventDefault();
												// Trigger search or filter
											}
										}}
									/>
								<button
									type="button"
									className="btn btn-ghost btn-sm w-full sm:w-auto"
									onClick={() => {
										setSearchTerm('');
										setStatusFilter('');
										setLanguageFilter('');
										setCategoryFilter('');
										setSeriesFilter('');
									}}
								>
									Clear Filters
								</button>
								<select 
									className="select select-bordered select-sm w-full sm:w-auto"
									value={statusFilter}
									onChange={(e) => setStatusFilter(e.target.value as ArticleStatus | '')}
								>
									<option value="">All Status</option>
									<option value="published">Published</option>
									<option value="draft">Draft</option>
									<option value="archived">Archived</option>
								</select>
								<select 
									className="select select-bordered select-sm w-full sm:w-auto"
									value={languageFilter}
									onChange={(e) => setLanguageFilter(e.target.value as SupportedLanguage | '')}
								>
									<option value="">All Languages</option>
									<option value="en">English</option>
									<option value="ar">Arabic</option>
									<option value="id">Indonesian</option>
									<option value="tr">Turkish</option>
								</select>
								<select 
									className="select select-bordered select-sm w-full sm:w-auto"
									value={categoryFilter}
									onChange={(e) => setCategoryFilter(e.target.value)}
								>
									<option value="">All Categories</option>
									{categoriesResponse?.data?.map((category) => (
										<option key={category._id} value={category._id}>
											{category.title}
										</option>
									))}
								</select>
								<select 
									className="select select-bordered select-sm w-full sm:w-auto"
									value={seriesFilter}
									onChange={(e) => setSeriesFilter(e.target.value)}
								>
									<option value="">All Series</option>
									{seriesResponse?.data?.map((series) => (
										<option key={series._id} value={series._id}>
											{series.title}
										</option>
									))}
								</select>
							</div>
					</div>
					
					{/* Mobile Card View */}
					<div className="lg:hidden space-y-4">
						{isLoading ? (
							<div className="text-center py-8">
								<span className="loading loading-spinner loading-lg"></span>
								<p className="mt-2">Loading articles...</p>
							</div>
						) : error ? (
							<div className="text-center py-8 text-error">
								<p>Error loading articles. Please try again.</p>
							</div>
						) : filteredArticles.length === 0 ? (
							<div className="text-center py-8 text-base-content/70">
								<p>No articles found matching your search criteria.</p>
							</div>
						) : (
							filteredArticles.map((article) => (
								<div key={article._id} className="card bg-base-200 p-4">
									<div className="space-y-3">
										{/* Title and Status */}
										<div className="flex justify-between items-start">
											<div className="flex-1">
												<h4 className="font-bold text-sm lg:text-base">{article.title}</h4>
												<p className="text-xs opacity-50">Slug: {article.slug}</p>
												{article.subtitle && article.subtitle.trim() && (
													<p className="text-xs opacity-70 italic">{article.subtitle}</p>
												)}
											</div>
											<select
												className="select select-bordered select-xs ml-2"
												value={article.status}
												onChange={(e) => handleStatusChange(article, e.target.value as ArticleStatus)}
											>
												<option value="draft">Draft</option>
												<option value="published">Published</option>
												<option value="archived">Archived</option>
											</select>
										</div>

										{/* Language and Author */}
										<div className="flex items-center gap-2 text-xs">
											<FaGlobe className="text-primary" />
											<span className="badge badge-outline badge-xs">
												{getLanguageLabel(article.language)}
											</span>
											<span className="opacity-70">•</span>
											<span>{article.author}</span>
										</div>

										{/* Categories and Series */}
										<div className="flex flex-wrap gap-1">
											{article.categories && article.categories.length > 0 ? (
												article.categories.map((categoryId) => {
													const category = categoriesResponse?.data?.find(c => c._id === categoryId);
													return category ? (
														<span key={categoryId} className="badge badge-outline badge-xs">
															{category.title}
														</span>
													) : null;
												})
											) : (
												<span className="text-xs opacity-50">No categories</span>
											)}
											{article.series && article.series.id && (
												<span className="badge badge-primary badge-xs">
													{seriesResponse?.data?.find(s => s._id === article.series?.id)?.title || 'Unknown Series'}
												</span>
											)}
										</div>

										{/* Published Date and Views */}
										<div className="flex justify-between items-center text-xs">
											<span>
												{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Not published'}
											</span>
											<span>Views: {article.stats?.views?.toLocaleString() || '0'}</span>
										</div>

										{/* Featured and Latest Toggles */}
										<div className="flex gap-2">
											<button
												className={`btn btn-xs ${article.isFeatured ? 'btn-primary' : 'btn-ghost'}`}
												onClick={() => handleToggleFeatured(article)}
											>
												<FaStar className={article.isFeatured ? 'text-yellow-400' : ''} />
												<span className="ml-1">Featured</span>
											</button>
											<button
												className={`btn btn-xs ${article.isLatest ? 'btn-secondary' : 'btn-ghost'}`}
												onClick={() => handleToggleLatest(article)}
											>
												<span className={article.isLatest ? 'text-blue-600' : ''}>Latest</span>
											</button>
										</div>

										{/* Actions */}
										<div className="flex gap-2 pt-2 border-t border-base-300">
											<button className="btn btn-ghost btn-xs flex-1" title="Edit" onClick={() => { setSelectedArticle(article); setIsEditModalOpen(true); }}>
												<FaEdit />
												<span className="ml-1">Edit</span>
											</button>
											<button 
												className="btn btn-ghost btn-xs flex-1 text-error" 
												title="Delete"
												onClick={() => handleDeleteArticle(article._id)}
											>
												<FaTrash />
												<span className="ml-1">Delete</span>
											</button>
											<button className="btn btn-ghost btn-xs flex-1" title="View" onClick={() => { setSelectedArticle(article); setIsViewModalOpen(true); }}>
												<FaEye />
												<span className="ml-1">View</span>
											</button>
										</div>
									</div>
								</div>
							))
						)}
					</div>

					{/* Desktop Table View */}
					<div className="hidden lg:block overflow-x-auto">
						<table className="table table-zebra">
							<thead>
								<tr>
									<th>Title</th>
									<th>Language</th>
									<th>Status</th>
									<th>Categories</th>
									<th>Series</th>
									<th>Author</th>
									<th>Published</th>
									<th>Views</th>
									<th>Featured</th>
									<th>Latest</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{isLoading ? (
									<tr>
										<td colSpan={11} className="text-center py-8">
											<span className="loading loading-spinner loading-lg"></span>
											<p className="mt-2">Loading articles...</p>
										</td>
									</tr>
								) : error ? (
									<tr>
										<td colSpan={11} className="text-center py-8 text-error">
											<p>Error loading articles. Please try again.</p>
										</td>
									</tr>
								) : filteredArticles.length === 0 ? (
									<tr>
										<td colSpan={11} className="text-center py-8 text-base-content/70">
											<p>No articles found matching your search criteria.</p>
										</td>
									</tr>
								) : (
									filteredArticles.map((article) => (
										<tr key={article._id}>
											<td>
												<div>
													<div className="font-bold">{article.title}</div>
													<div className="text-sm opacity-50">Slug: {article.slug}</div>
													{article.subtitle && article.subtitle.trim() && (
														<div className="text-sm opacity-70 italic">{article.subtitle}</div>
													)}
												</div>
											</td>
											<td>
												<div className="flex items-center gap-2">
													<FaGlobe className="text-primary" />
													<span className="badge badge-outline badge-sm">
														{getLanguageLabel(article.language)}
													</span>
												</div>
											</td>
											<td>
												<select
													className="select select-bordered select-xs"
													value={article.status}
													onChange={(e) => handleStatusChange(article, e.target.value as ArticleStatus)}
												>
													<option value="draft">Draft</option>
													<option value="published">Published</option>
													<option value="archived">Archived</option>
												</select>
											</td>
											<td>
												<div className="flex flex-wrap gap-1">
													{article.categories && article.categories.length > 0 ? (
														article.categories.map((categoryId) => {
															const category = categoriesResponse?.data?.find(c => c._id === categoryId);
															return category ? (
																<span key={categoryId} className="badge badge-outline badge-xs">
																	{category.title}
																</span>
															) : null;
														})
													) : (
														<span className="text-xs opacity-50">No categories</span>
													)}
												</div>
											</td>
											<td>
												{article.series && article.series.id ? (
													<span className="badge badge-primary badge-xs">
														{seriesResponse?.data?.find(s => s._id === article.series?.id)?.title || 'Unknown Series'}
													</span>
												) : (
													<span className="text-xs opacity-50">No series</span>
												)}
											</td>
											<td>{article.author}</td>
											<td>
												<div className="text-sm">
													{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Not published'}
												</div>
											</td>
											<td>{article.stats?.views?.toLocaleString() || '0'}</td>
											<td>
												<button
													className={`btn btn-xs ${article.isFeatured ? 'btn-primary' : 'btn-ghost'}`}
													onClick={() => handleToggleFeatured(article)}
												>
													<FaStar className={article.isFeatured ? 'text-yellow-400' : ''} />
												</button>
											</td>
											<td>
												<button
													className={`btn btn-xs ${article.isLatest ? 'btn-secondary' : 'btn-ghost'}`}
													onClick={() => handleToggleLatest(article)}
												>
													<span className={article.isLatest ? 'text-blue-600' : ''}>LATEST</span>
												</button>
											</td>
											<td>
												<div className="flex gap-2">
													<button className="btn btn-ghost btn-xs" title="Edit" onClick={() => { setSelectedArticle(article); setIsEditModalOpen(true); }}>
														<FaEdit />
													</button>
													<button 
														className="btn btn-ghost btn-xs text-error" 
														title="Delete"
														onClick={() => handleDeleteArticle(article._id)}
													>
														<FaTrash />
													</button>
													<button className="btn btn-ghost btn-xs" title="View" onClick={() => { setSelectedArticle(article); setIsViewModalOpen(true); }}>
														<FaEye />
													</button>
												</div>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
					
					 {/* Pagination */}
					 {totalPages > 1 && (
						 <div className="flex justify-center mt-4 lg:mt-6">
							 <div className="join">
								 <button
									 className="join-item btn btn-xs lg:btn-sm"
									 disabled={currentPage === 1}
									 onClick={() => setCurrentPage(currentPage - 1)}
								 >
									 «
								 </button>
								 
								 {/* Show fewer page numbers on mobile */}
								 {Array.from({ length: Math.min(window.innerWidth < 768 ? 3 : 5, totalPages) }, (_, i) => {
									 const pageNum = Math.max(1, Math.min(totalPages - (window.innerWidth < 768 ? 2 : 4), currentPage - (window.innerWidth < 768 ? 1 : 2))) + i;
									 if (pageNum > totalPages) return null;
									 
									 return (
										 <button
											 key={pageNum}
											 className={`join-item btn btn-xs lg:btn-sm ${currentPage === pageNum ? 'btn-active' : ''}`}
											 onClick={() => setCurrentPage(pageNum)}
										 >
											 {pageNum}
										 </button>
									 );
								 })}
								 
								 <button
									 className="join-item btn btn-xs lg:btn-sm"
									 disabled={currentPage === totalPages}
									 onClick={() => setCurrentPage(currentPage + 1)}
								 >
									 »
								 </button>
							 </div>
						 </div>
					 )}
				 </div>
			 </div>
			
			 {/* Create Article Modal */}
			 <CreateArticleModal
				 isOpen={isCreateModalOpen}
				 onClose={() => setIsCreateModalOpen(false)}
				 onSuccess={() => {
					 setIsCreateModalOpen(false);
					 // The API will automatically refetch due to cache invalidation
				 }}
			 />
			
			 {/* Edit Article Modal */}
			 <ArticleModal
				 isOpen={isEditModalOpen}
				 onClose={() => { setIsEditModalOpen(false); setSelectedArticle(undefined); }}
				 onSuccess={() => { setIsEditModalOpen(false); setSelectedArticle(undefined); }}
				 mode="edit"
				 article={selectedArticle}
			 />
			
			 {/* View Article Modal */}
			 <ViewArticleModal
				 isOpen={isViewModalOpen}
				 onClose={() => { setIsViewModalOpen(false); setSelectedArticle(undefined); }}
				 article={selectedArticle}
			 />
		 </div>
	);
};

export default ArticleManagement;
