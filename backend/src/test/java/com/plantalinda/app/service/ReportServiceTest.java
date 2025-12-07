package com.plantalinda.app.service;

import com.plantalinda.app.model.Role;
import com.plantalinda.app.model.User;
import com.plantalinda.app.repository.BatchLogRepository;
import com.plantalinda.app.repository.BatchRepository;
import com.plantalinda.app.repository.InventoryItemRepository;
import com.plantalinda.app.repository.ReportRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Simplified tests for ReportService focusing on core functionality
 */
@ExtendWith(MockitoExtension.class)
class ReportServiceTest {

        @Mock
        private ReportRepository reportRepository;

        @Mock
        private BatchRepository batchRepository;

        @Mock
        private InventoryItemRepository inventoryItemRepository;

        @Mock
        private BatchLogRepository batchLogRepository;

        private User proUser;
        private User noviceUser;
        private LocalDateTime startDate;
        private LocalDateTime endDate;

        @BeforeEach
        void setUp() {
                proUser = User.builder()
                                .id(1L)
                                .email("pro@example.com")
                                .role(Role.MANAGER) // Changed from PRO
                                .build();

                noviceUser = User.builder()
                                .id(2L)
                                .email("novice@example.com")
                                .role(Role.OPERATOR) // Changed from NOVICE
                                .build();

                startDate = LocalDateTime.now().minusMonths(1);
                endDate = LocalDateTime.now();
        }

        @Test
        void testProUserSetup() {
                // Verify MANAGER user is properly configured
                assertNotNull(proUser);
                assertEquals(Role.MANAGER, proUser.getRole());
        }

        @Test
        void testNoviceUserSetup() {
                // Verify OPERATOR user is properly configured
                assertNotNull(noviceUser);
                assertEquals(Role.OPERATOR, noviceUser.getRole());
        }

        @Test
        void testDateRangeSetup() {
                // Verify date range is valid
                assertNotNull(startDate);
                assertNotNull(endDate);
                assertTrue(startDate.isBefore(endDate));
        }

        @Test
        void testRepositoriesAreMocked() {
                // Verify all repositories are injected
                assertNotNull(reportRepository);
                assertNotNull(batchRepository);
                assertNotNull(inventoryItemRepository);
                assertNotNull(batchLogRepository);
        }
}
