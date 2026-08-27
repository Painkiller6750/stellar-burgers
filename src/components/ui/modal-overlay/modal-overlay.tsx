// src/components/ui/modal-overlay/modal-overlay.tsx
import styles from './modal-overlay.module.css';

export const ModalOverlayUI = ({ onClick }: { onClick: () => void }) => (
  <div
    data-testid='modal-overlay'
    className={styles.overlay}
    onClick={onClick}
  />
);
