import { useRouter, useSearchParams } from 'next/navigation';

export default function useOpenModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modal = searchParams.get('modal');

  function handleOpenModal(type: string) {
    const currentUrl = new URL(window.location.href);

    if (modal === type) return;

    currentUrl.searchParams.set('modal', type);

    router.push(currentUrl.toString(), {
      scroll: false,
    });
  }

  return handleOpenModal;
}
