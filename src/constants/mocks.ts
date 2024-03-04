import { DATA_TYPE_WITHOUT_ENUM } from '@domain/dataDictionary';

export const userDefinedData = [
  {
    variableName: 'Promocode',
    source: 'LaPMS',
    variableType: 'Input',
    dataType: 'enum',
    defaultValue: '',
    isRequired: false,
    usageMode: 'ReadOnly',
    allowedValues: [
      'Push',
      'Test',
      'HIS10YOURS',
      'SAVE25',
      'EARNED35',
      'HERETAKE50',
      'FIRSTOFF75',
      'OrganicDir',
      'OrganicLCDir',
      'BUYOUT',
      'PUMPKIN',
      'TURKEY',
      'XMAS',
      'BFCM',
      'NEWYEAR',
      'VIPS',
      'LOVE',
      'EGGS',
      'MOBILE',
      'SCHOOL75',
      'FACEBOOK',
      'TIKTOK',
      'YOUTUBE',
      'GIFT15',
      'Bing',
      'Google'
    ],
    description: 'Promocode the lead specified in application form'
  },

  {
    variableName: 'LoyaltyTier',
    source: 'LMS',
    variableType: 'Output',
    dataType: 'enum:LoyaltyTier',
    defaultValue: 'LoyaltyTier.New',
    isRequired: true,
    usageMode: 'ReadWrite',
    allowedValues: [
      'LoyaltyTier.New',
      'LoyaltyTier.Silver',
      'LoyaltyTier.Gold',
      'LoyaltyTier.Platinum'
    ],
    description:
      'Loyalty Tier the user assigned depending on his loyalty to our brand'
  },
  {
    variableName: 'AvgNetMonthlyIncome',
    source: 'LaPMS',
    variableType: 'Input',
    dataType: 'Decimal',
    defaultValue: '',
    isRequired: true,
    usageMode: 'ReadOnly',
    allowedValues: '',
    description:
      "Customer's Averege Net Monthly Income as specified in application form"
  },
  {
    variableName: 'Phonenumber',
    source: 'LaPMS',
    variableType: 'Input',
    dataType: 'String',
    defaultValue: '',
    isRequired: true,
    usageMode: 'ReadOnly',
    allowedValues: '',
    description: ''
  },
  {
    variableName: 'PhonenumberPrefix',
    source: 'UserDefined',
    variableType: 'TemporaryVariable',
    dataType: 'String',
    defaultValue: '',
    isRequired: false,
    usageMode: 'ReadWrite',
    allowedValues: '',
    description: ''
  },
  {
    variableName: 'EmailExtension',
    source: 'UserDefined',
    variableType: 'TemporaryVariable',
    dataType: 'String',
    defaultValue: '',
    isRequired: false,
    usageMode: 'ReadWrite',
    allowedValues: '',
    description: ''
  },
  {
    variableName: 'PreCalculatedMaxLoanAmount',
    source: 'UserDefined',
    variableType: 'TemporaryVariable',
    dataType: 'Decimal',
    defaultValue: '',
    isRequired: false,
    usageMode: 'ReadWrite',
    allowedValues: '',
    description: ''
  },
  {
    variableName: 'CalculatedLoanAmountMultiplier',
    source: 'UserDefined',
    variableType: 'TemporaryVariable',
    dataType: 'Decimal',
    defaultValue: '',
    isRequired: false,
    usageMode: 'ReadWrite',
    allowedValues: '',
    description: ''
  },
  {
    variableName: 'MaxLoanAmount',
    source: 'UserDefined',
    variableType: 'TemporaryVariable',
    dataType: 'Decimal',
    defaultValue: '',
    isRequired: false,
    usageMode: 'ReadWrite',
    allowedValues: '',
    description: ''
  },
  {
    variableName: 'RequestedLoanAmount',
    source: 'LaPMS',
    variableType: 'Input',
    dataType: 'Decimal',
    defaultValue: '',
    isRequired: true,
    usageMode: 'ReadOnly',
    allowedValues: '',
    description: ''
  },
  {
    variableName: 'FinalLoanAmount',
    destination: 'LMS',
    variableType: 'Output',
    dataType: 'Decimal',
    defaultValue: '',
    isRequired: true,
    usageMode: 'ReadWrite',
    allowedValues: '',
    description: ''
  },

  {
    variableName: 'Store',
    source: 'LMS',
    variableType: 'Output',
    dataType: 'enum:Store',
    defaultValue: '',
    isRequired: true,
    usageMode: 'ReadWrite',
    allowedValues: [
      'Store.LeadBuy',
      'Store.Organic',
      'Store.Special',
      'Store.Test'
    ],
    description:
      'Store define the flow how the application will be processed in PLM infinity LMS'
  }
];

// TODO: Remove after Data Dictionary will be implemented
export const TEMPORARY_VARIABLES_MOCK = [
  {
    variableName: 'PhonenumberPrefix',
    variableDataType: DATA_TYPE_WITHOUT_ENUM.String,
    variableValue: '+1'
  },
  {
    variableName: 'EmailExtension',
    variableDataType: DATA_TYPE_WITHOUT_ENUM.String,
    variableValue: 'test@gmail.com'
  },
  {
    variableName: 'PreCalculatedMaxLoanAmount',
    variableDataType: DATA_TYPE_WITHOUT_ENUM.Integer,
    variableValue: '1000'
  },
  {
    variableName: 'CalculatedLoanAmountMultiplier',
    variableDataType: DATA_TYPE_WITHOUT_ENUM.Integer,
    variableValue: '1000'
  },
  {
    variableName: 'MaxLoanAmount',
    variableDataType: DATA_TYPE_WITHOUT_ENUM.Integer,
    variableValue: '1000'
  }
];
