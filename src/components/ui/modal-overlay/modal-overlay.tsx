import styles from './modal-overlay.module.css';

export const ModalOverlayUI = ({ onClick }: { onClick: () => void }) => (
  <div className={styles.overlay} data-cy='overlay' onClick={onClick} />
);
