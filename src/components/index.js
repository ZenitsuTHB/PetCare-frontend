// ✅ Re-exports directos - preservan el stack trace original
export { default as EmptyState } from './EmptyState/EmptyState';
export { default as PageHeader } from './Headers/PageHeader';
export { default as ContentContainer } from './ContentContainer/ContentContainer';
export { default as Button } from './Button/Button';
export { default as Footer } from './Footer';
export { default as Header } from './Header';
export { default as ProvincePicker } from './ProvincePicker';
export { default as WaveBackground } from './WaveBackground';

// ✅ También puedes exportar sin alias para mantener nombres originales
// export { default as EmptyState } from './EmptyState/EmptyState';
// Es equivalente a:
// import EmptyState from './EmptyState/EmptyState';
// export { EmptyState };