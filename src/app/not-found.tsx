'use client';

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const NotFound = () => {
  const { t } = useTranslation();
  const pathname = usePathname();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", pathname);
  }, [pathname]);

  return (
    <PublicLayout title={t('notFound.seo.title')} description={t('notFound.seo.description')}>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-sm text-muted-foreground mb-2">404</p>
        <h1 className="text-3xl sm:text-4xl font-semibold mb-4">
          {t('notFound.heading')}
        </h1>
        <p className="text-muted-foreground max-w-md mb-6">
          {t('notFound.body')}
        </p>
        <Button asChild>
          <Link href="/">
            {t('notFound.primaryCtaLabel')}
          </Link>
        </Button>
      </div>
    </PublicLayout>
  );
};

export default NotFound;