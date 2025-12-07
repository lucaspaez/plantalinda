package com.cannabis.app.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class FileStorageServiceTest {

    private FileStorageService fileStorageService;

    @TempDir
    Path tempDir;

    @BeforeEach
    void setUp() {
        fileStorageService = new FileStorageService();
    }

    @Test
    void store_WithValidJpgImage_ShouldStoreFile() {
        // Given
        MultipartFile file = new MockMultipartFile(
                "image",
                "test.jpg",
                "image/jpeg",
                "test image content".getBytes());

        // When
        String filename = fileStorageService.store(file);

        // Then
        assertNotNull(filename);
        assertTrue(filename.endsWith(".jpg"));
        assertTrue(filename.contains("-")); // UUID format
    }

    @Test
    void store_WithValidPngImage_ShouldStoreFile() {
        // Given
        MultipartFile file = new MockMultipartFile(
                "image",
                "test.png",
                "image/png",
                "test image content".getBytes());

        // When
        String filename = fileStorageService.store(file);

        // Then
        assertNotNull(filename);
        assertTrue(filename.endsWith(".png"));
    }

    @Test
    void store_WithInvalidExtension_ShouldThrowException() {
        // Given
        MultipartFile file = new MockMultipartFile(
                "file",
                "test.exe",
                "application/octet-stream",
                "malicious content".getBytes());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            fileStorageService.store(file);
        });

        assertTrue(exception.getMessage().contains("Invalid file type"));
    }

    @Test
    void store_WithInvalidMimeType_ShouldThrowException() {
        // Given
        MultipartFile file = new MockMultipartFile(
                "file",
                "test.jpg",
                "application/pdf", // Wrong MIME type
                "test content".getBytes());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            fileStorageService.store(file);
        });

        assertTrue(exception.getMessage().contains("Invalid content type"));
    }

    @Test
    void store_WithEmptyFile_ShouldThrowException() {
        // Given
        MultipartFile file = new MockMultipartFile(
                "image",
                "test.jpg",
                "image/jpeg",
                new byte[0]);

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            fileStorageService.store(file);
        });

        assertTrue(exception.getMessage().contains("empty file"));
    }

    @Test
    void store_WithNullFilename_ShouldThrowException() {
        // Given
        MultipartFile file = new MockMultipartFile(
                "image",
                null,
                "image/jpeg",
                "test content".getBytes());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            fileStorageService.store(file);
        });

        assertTrue(exception.getMessage().contains("Invalid file name"));
    }

    @Test
    void store_WithFilenameWithoutExtension_ShouldThrowException() {
        // Given
        MultipartFile file = new MockMultipartFile(
                "image",
                "testfile",
                "image/jpeg",
                "test content".getBytes());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            fileStorageService.store(file);
        });

        assertTrue(exception.getMessage().contains("Invalid file name"));
    }

    @Test
    void store_ShouldSanitizeFilename() {
        // Given
        MultipartFile file = new MockMultipartFile(
                "image",
                "../../../etc/passwd.jpg", // Path traversal attempt
                "image/jpeg",
                "test content".getBytes());

        // When
        String filename = fileStorageService.store(file);

        // Then
        assertNotNull(filename);
        assertFalse(filename.contains(".."));
        assertFalse(filename.contains("/"));
        assertFalse(filename.contains("passwd"));
        assertTrue(filename.endsWith(".jpg"));
    }

    @Test
    void store_WithMixedCaseExtension_ShouldNormalizeToLowercase() {
        // Given
        MultipartFile file = new MockMultipartFile(
                "image",
                "test.JPG",
                "image/jpeg",
                "test content".getBytes());

        // When
        String filename = fileStorageService.store(file);

        // Then
        assertNotNull(filename);
        assertTrue(filename.endsWith(".jpg"));
        assertFalse(filename.endsWith(".JPG"));
    }

    @Test
    void store_MultipleFiles_ShouldGenerateUniqueFilenames() {
        // Given
        MultipartFile file1 = new MockMultipartFile(
                "image1",
                "test.jpg",
                "image/jpeg",
                "content1".getBytes());

        MultipartFile file2 = new MockMultipartFile(
                "image2",
                "test.jpg",
                "image/jpeg",
                "content2".getBytes());

        // When
        String filename1 = fileStorageService.store(file1);
        String filename2 = fileStorageService.store(file2);

        // Then
        assertNotNull(filename1);
        assertNotNull(filename2);
        assertNotEquals(filename1, filename2);
    }
}
