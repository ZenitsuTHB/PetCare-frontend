// ✅ Re-exports directos - preservan el stack trace original
export { default as EmptyState } from './EmptyState/EmptyState';
export { default as PageHeader } from './Headers/PageHeader';
export { default as ContentContainer } from './ContentContainer/ContentContainer';
export { default as Button } from './Button/Button';
export { default as Dropdown } from './Dropdown/Dropdown';
export { default as PetCard } from './Cards/PetCard';
export { default as ConfirmationModal } from './Modal/ConfirmationModal';
export { default as Footer } from './Utils/Footer';
export { default as Header } from './Headers/Header';
export { default as ProvincePicker } from './Utils/ProvincePicker';
export { default as PetCard } from './Cards/PetCard';

// ✅ También puedes exportar sin alias para mantener nombres originales
// export { default as EmptyState } from './EmptyState/EmptyState';
// Es equivalente a:
// import EmptyState from './EmptyState/EmptyState';
// export { EmptyState };