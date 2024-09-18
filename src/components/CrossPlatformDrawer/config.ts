import adminPanelIcon from '@images/platforms/admin-panel.png';
import lmsIcon from '@images/platforms/lms.png';
import underwritingIcon from '@images/platforms/underwriting.png';
import leadManagementIcon from '@images/platforms/lead-management.png';
import communicationIcon from '@images/platforms/communication.png';
import paymentsIcon from '@images/platforms/payments.png';
import reportsIcon from '@images/platforms/reports.png';
import iamIcon from '@images/platforms/iam.png';

export const applications = [
  {
    key: 'IAM',
    name: 'Access Management',
    iconSrc: iamIcon,
    className: 'iam'
  },
  {
    key: 'Communication Platform',
    name: 'Communication Platform',
    iconSrc: communicationIcon,
    className: 'communication'
  },
  {
    key: 'ElwAdmin',
    name: 'Admin Panel',
    iconSrc: adminPanelIcon,
    className: 'admin'
  },
  {
    key: 'LMS',
    name: 'Loan Management System',
    iconSrc: lmsIcon,
    className: 'lms'
  },
  {
    key: 'Underwriting',
    name: 'Underwriting',
    iconSrc: underwritingIcon,
    className: 'underwriting'
  },
  {
    key: 'Lead Management',
    name: 'Lead Management',
    iconSrc: leadManagementIcon,
    className: 'leads'
  },
  {
    key: 'Payment Platform',
    name: 'Payment Platform',
    iconSrc: paymentsIcon,
    className: 'payments'
  },
  {
    key: 'Reporting',
    name: 'Reporting',
    iconSrc: reportsIcon,
    className: 'reports'
  }
];
