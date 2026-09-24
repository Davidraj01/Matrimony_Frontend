import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import useStaticSeoOverride from "../utils/useStaticSeoOverride.js";
import toast from "react-hot-toast";
import { getBlogBySlug } from "../services/blogApi";
import { IMAGE_BASE_URL } from "../services/config";
import { PLACEHOLDER_IMAGE } from "../../utils/placeholder.js";
import { sanitizeBlogHtml, htmlToExcerpt } from "../utils/sanitizeHtml.js";

const SITE_URL = "https://www.royalmatrimony.org";

const imageUrl = (path) => {
  if (!path) return PLACEHOLDER_IMAGE;
  const cleanPath = path.replace(/^\/+/, "");
  return `${IMAGE_BASE_URL}/${cleanPath}`;
};

export default function BlogPost() {
  useStaticSeoOverride();
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const data = await getBlogBySlug(slug);
        setBlog(data);
      } catch (err) {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          toast.error("Failed to load blog post");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) return <p className="p-6 text-center text-gray-500">Loading...</p>;

  if (notFound) {
    return (
      <div className="p-6 text-center">
        <Helmet>
          <title>Post not found — Royal Matrimony Blog</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <p className="text-gray-500">Blog post not found.</p>
        <Link to="/blog" className="text-pink-500 font-medium mt-2 inline-block">
          Back to Blog
        </Link>
      </div>
    );
  }

  const canonicalUrl = `${SITE_URL}/blog/${blog.slug}`;
  const coverImageUrl = imageUrl(blog.coverImage);
  const description = htmlToExcerpt(blog.body);
  const publishedTime = new Date(blog.createdAt).toISOString();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description,
    image: coverImageUrl,
    datePublished: publishedTime,
    dateModified: blog.updatedAt ? new Date(blog.updatedAt).toISOString() : publishedTime,
    author: { "@type": "Organization", name: "Royal Matrimony" },
    publisher: { "@type": "Organization", name: "Royal Matrimony" },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    keywords: (blog.tags || []).join(", "),
    inLanguage: "en-IN",
    url: canonicalUrl,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 2, name: blog.title, item: canonicalUrl },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 pb-20">
      <Helmet>
        <title>
          {/royal matrimony/i.test(blog.title)
            ? blog.title
            : `${blog.title} | Royal Matrimony`}
        </title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={coverImageUrl} />
        <meta property="article:published_time" content={publishedTime} />
        {(blog.tags || []).map((tag) => (
          <meta property="article:tag" content={tag} key={tag} />
        ))}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={coverImageUrl} />

        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow overflow-hidden">
        <img
          src={coverImageUrl}
          alt={blog.title}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <Link to="/blog" className="text-sm text-pink-500">
            &larr; Back to Blog
          </Link>
          <h1 className="text-2xl font-bold mt-2">{blog.title}</h1>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(blog.createdAt).toLocaleDateString()}
          </p>
          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-pink-50 text-pink-500 px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div
            className="blog-content text-gray-700 mt-4"
            dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(blog.body) }}
          />
        </div>
      </div>
    </div>
  );
}
