# Changelog

## [0.2.0] - 2025-12-09

### Added
- **Frontend Export for Reports**: Added CSV export and Print/PDF functionality to the Reports page.
- **Report Translations**: All report headers, labels, and inventory categories are now translated to Spanish.
- **Report Visualization**: Improved "Print" view to render styled HTML tables and summary cards instead of raw JSON.

### Fixed
- **JSON Serialization Error**: Fixed `StackOverflowError` caused by circular dependency between `User` and `Organization` entities using `@JsonIgnoreProperties`.
- **Hibernate Proxy Serialization**: Fixed `InvalidDefinitionException` for `ByteBuddyInterceptor` by ignoring Hibernate proxy fields in Jackson serialization for `Report`, `User`, and `Organization`.
- **Report Generation NPE**: Fixed `NullPointerException` in `ReportService` when generating reports with null fields (e.g., missing status or plant count).
- **Frontend Syntax Error**: Fixed nested JSX incorrectly causing compilation errors in `reports/page.tsx`.

### Security
- **Sensitive Data Exposure**: Added `@JsonIgnore` to `password` field in `User` entity to prevent accidental exposure in API responses.
