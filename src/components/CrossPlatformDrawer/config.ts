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
    key: 'ElwAdmin',
    name: 'Admin Panel',
    iconSrc: adminPanelIcon,
    className: 'admin'
  },
  {
    key: 'Communication Platform',
    name: 'Communication',
    iconSrc: communicationIcon,
    className: 'communication'
  },
  {
    key: 'Lead Management',
    name: 'Lead Management',
    iconSrc: leadManagementIcon,
    className: 'leads'
  },
  {
    key: 'LMS',
    name: 'Loan Management',
    iconSrc: lmsIcon,
    className: 'lms'
  },
  {
    key: 'Payment Platform',
    name: 'Payment Platform',
    iconSrc: paymentsIcon,
    className: 'payments'
  },
  {
    key: 'Reporting',
    name: 'Reports',
    iconSrc: reportsIcon,
    className: 'reports'
  },
  {
    key: 'Underwriting',
    name: 'Underwriting',
    iconSrc: underwritingIcon,
    className: 'underwriting'
  }
];
