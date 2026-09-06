// Мост над gateway: HTTP-доступ к методам контент-плагинов.

pub mod call;
pub mod manifests;
pub mod router;

pub use router::router;
