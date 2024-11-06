import Content from '@components/DataDictionary/Content';
import { useAppSelector } from '@store/hooks';
import { selectFlow } from '@store/flow/selectors';
import { Wrapper } from '@components/Layouts/styled';
import PageHeader from '@components/Layouts/PageHeader';
import FlowSelect from '@components/DataDictionary/FlowSelect';
import Breadcrumbs from '@components/DataDictionary/Breadcumbs';

const DataDictionary = () => {
  const { flow } = useAppSelector(selectFlow);

  return (
    <Wrapper>
      <Breadcrumbs name={flow.data.name} />
      <PageHeader title="Data Dictionary" wrapperProps={{ pb: 1 }}>
        <FlowSelect />
      </PageHeader>
      <Content flow={flow} />
    </Wrapper>
  );
};

export default DataDictionary;
