import { useState, useEffect } from 'react';
import {
  Accordion,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Typography
} from '@mui/material';
import { NavLink, useParams } from 'react-router-dom';

import { theme } from '../../themeConfig';

import {
  Label,
  SidebarToggle,
  StyledAccordion,
  StyledAccordionDetails,
  StyledMainAccordionSummary,
  StyledNavLink,
  StyledPaper,
  StyledSubAccordionSummary
} from './styled';

import {
  AngleLeftSquare,
  LineChartDots,
  TimePast,
  DocumentList,
  ExpandMoreIcon,
  Bezier
} from '@components/shared/Icons';
import { fetchFlowList } from '@store/flowList/asyncThunk';
import Logger from '@utils/logger';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { selectFlowList } from '@store/flowList/selectors';
import ActionsMenu from '@components/FlowManagment/ActionsMenu/ActionMenu';
import routes from '@constants/routes';
import { PRODUCTION_FLOW_ID } from '@constants/common';
import { getProductionFlow, getFlow } from '@store/flow/asyncThunk';
import { setInitialFlow } from '@store/flow/flow';
import { selectFlow } from '@store/flow/selectors';
import { useLoading } from '@contexts/LoadingContext';
import { AddFlow } from '@components/FlowManagment/AddFlow/AddFlowForm';
import StepListCopy from '@components/StepManagment/StepList/StepListCopy';
import { useStep } from '@contexts/StepContext';

const animationStyles = (expanded: boolean) => ({
  maxWidth: expanded ? '100%' : 0,
  transition: 'max-width 0.2s ease-in-out',
  overflow: 'hidden',
  whiteSpace: 'nowrap'
});

const Sidebar = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { resetActiveStepId } = useStep();
  const { flowList, flowProduction } = useAppSelector(selectFlowList);
  const { flow } = useAppSelector(selectFlow);

  const [expanded, setExpanded] = useState(true);
  const sidebarWidth = expanded ? 400 : 70;

  const { startLoading, stopLoading } = useLoading();

  const [expandedFlow, setExpandedFlow] = useState<string | false>(false);

  const handleChangeFlow =
    (panel: string) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpandedFlow(newExpanded ? panel : false);
    };

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    // Rename fetch data
    const fetchData = async () => {
      try {
        startLoading();
        await dispatch(fetchFlowList());
      } catch (error) {
        Logger.error('Error fetching data:', error);
      } finally {
        stopLoading();
      }
    };

    void fetchData();
  }, []);

  useEffect(() => {
    const fetchInitialData = async (flowId: string) => {
      try {
        startLoading();
        if (id === PRODUCTION_FLOW_ID) {
          await dispatch(getProductionFlow());
        } else {
          await dispatch(getFlow(flowId));
        }
      } catch (error) {
        Logger.error('Error fetching initial data:', error);
      } finally {
        stopLoading();
      }
    };

    resetActiveStepId();
    if (id) {
      void fetchInitialData(id);
    } else {
      dispatch(setInitialFlow());
    }
  }, [id]);

  return (
    <StyledPaper
      component="aside"
      elevation={0}
      sx={{
        minWidth: sidebarWidth
        // transition: 'width 0.2s ease-in-out'
      }}
    >
      <SidebarToggle
        fullWidth
        onClick={toggleSidebar}
        startIcon={<AngleLeftSquare />}
        rotated={expanded ? 0 : 1}
      >
        <Typography
          fontSize="15px"
          fontWeight="500"
          variant="body2"
          color={theme.palette.text.secondary}
          sx={animationStyles(expanded)}
        >
          Collapse Sidebar
        </Typography>
      </SidebarToggle>
      <List component="nav">
        {expanded ? (
          <Accordion sx={{ marginBottom: '8px' }}>
            <StyledMainAccordionSummary
              expandIcon={<ExpandMoreIcon color="primary" />}
              aria-controls="flowList-content"
              id="flowList-header"
            >
              <NavLink
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  flexGrow: 1,
                  alignItems: 'center'
                }}
                to={`${routes.underwriting.flow.list}`}
              >
                <ListItemIcon>
                  <LineChartDots />
                </ListItemIcon>
                <Typography sx={animationStyles(expanded)}>
                  Flow List
                </Typography>
              </NavLink>
            </StyledMainAccordionSummary>
            <StyledAccordionDetails>
              <Label variant="body2">Flow on Production</Label>
              <Accordion
                expanded={expandedFlow === PRODUCTION_FLOW_ID}
                onChange={handleChangeFlow(PRODUCTION_FLOW_ID)}
              >
                <StyledNavLink
                  to={`${routes.underwriting.flow.list}/${PRODUCTION_FLOW_ID}`}
                >
                  <StyledSubAccordionSummary
                    expandIcon={<ExpandMoreIcon fontSize="small" />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={{
                      flexDirection: 'row-reverse',
                      minHeight: '28px'
                    }}
                  >
                    <ListItemIcon>
                      <Bezier />
                    </ListItemIcon>
                    <Typography variant="body2">
                      {flowProduction?.name}
                    </Typography>
                  </StyledSubAccordionSummary>
                </StyledNavLink>
                <StyledAccordionDetails>
                  <StepListCopy nodes={flow.nodes} />
                </StyledAccordionDetails>
              </Accordion>
              <Label variant="body2">Draft Flows</Label>
              {flowList.map((flowItem) => (
                <StyledAccordion
                  key={flowItem.id}
                  expanded={expandedFlow === flowItem.id}
                  onChange={handleChangeFlow(flowItem.id)}
                >
                  <Box sx={{ position: 'relative' }}>
                    <StyledNavLink
                      to={`${routes.underwriting.flow.list}/${flowItem.id}`}
                    >
                      <StyledSubAccordionSummary
                        expandIcon={<ExpandMoreIcon fontSize="medium" />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <ListItemIcon>
                          <Bezier />
                        </ListItemIcon>
                        <Typography variant="body2">{flowItem.name}</Typography>
                      </StyledSubAccordionSummary>
                    </StyledNavLink>
                    <ListItemSecondaryAction>
                      <ActionsMenu flow={flowItem} />
                    </ListItemSecondaryAction>
                  </Box>
                  <StyledAccordionDetails>
                    <StepListCopy nodes={flow.nodes} />
                  </StyledAccordionDetails>
                </StyledAccordion>
              ))}
              <AddFlow />
            </StyledAccordionDetails>
          </Accordion>
        ) : (
          <ListItem button component={NavLink} to="/flow-list">
            <ListItemIcon>
              <LineChartDots />
            </ListItemIcon>
          </ListItem>
        )}
        {[
          {
            icon: <TimePast />,
            text: 'Changes History',
            to: routes.underwriting.changeHistory
          },
          {
            icon: <DocumentList />,
            text: 'Reports',
            to: routes.underwriting.leadRequest
          }
        ].map((item, index) => (
          <ListItem
            button
            key={index}
            component={NavLink}
            to={item.to}
            sx={{ height: '32px', marginBottom: '8px' }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} sx={animationStyles(expanded)} />
          </ListItem>
        ))}
      </List>
    </StyledPaper>
  );
};

export default Sidebar;
