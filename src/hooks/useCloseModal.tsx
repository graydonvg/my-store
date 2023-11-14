import { useRouter } from 'next/navigation';

export default function useCloseModal() {
  const router = useRouter();

  function handleCloseModal() {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete('modal');

    router.push(currentUrl.toString(), {
      scroll: false,
    });
  }

  return handleCloseModal;
}
