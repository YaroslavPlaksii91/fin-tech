export const userDefinedData = [
  {
    variableName: 'Promocode',
    source: 'LaPMS',
    variableType: 'input',
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
    variableType: 'output',
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
    variableName: 'Promocode',
    source: 'LaPMS',
    variableType: 'input',
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
    variableName: 'AvgNetMonthlyIncome',
    source: 'LaPMS',
    variableType: 'input',
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
    variableType: 'input',
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
    variableType: 'temporaryVariable',
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
    variableType: 'temporaryVariable',
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
    variableType: 'temporaryVariable',
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
    variableType: 'temporaryVariable',
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
    variableType: 'temporaryVariable',
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
    variableType: 'input',
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
    variableType: 'output',
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
    variableType: 'output',
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
