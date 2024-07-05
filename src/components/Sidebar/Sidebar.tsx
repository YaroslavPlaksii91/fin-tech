import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Accordion,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Typography
} from '@mui/material';
import { NavLink, useParams } from 'react-router-dom';

import {
  Label,
  Resizer,
  SidebarToggle,
  StyledAccordion,
  StyledAccordionDetails,
  StyledListItemButton,
  StyledMainAccordionSummary,
  StyledNavLink,
  StyledPaper,
  StyledSubAccordionSummary
} from './styled';

import DotIcon from '@icons/dot.svg';
import LineChartDotsIcon from '@icons/lineChartDots.svg';
import AngleLeftSquareIcon from '@icons/angleLeftSquare.svg';
import TimePastIcon from '@icons/timePast.svg';
import DocumentPaperIcon from '@icons/documentPaper.svg';
import BezierIcon from '@icons/bezier.svg';
import { ExpandMoreIcon } from '@components/shared/Icons';
import { fetchFlowList } from '@store/flowList/asyncThunk';
import Logger from '@utils/logger';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { getProductionFlow, getFlow } from '@store/flow/asyncThunk';
import { selectFlowList } from '@store/flowList/selectors';
import { setInitialFlow } from '@store/flow/flow';
import { selectFlow } from '@store/flow/selectors';
import ActionsMenu from '@components/FlowManagment/ActionsMenu/ActionMenu';
import routes from '@constants/routes';
import { PRODUCTION_FLOW_ID } from '@constants/common';
import { useLoading } from '@contexts/LoadingContext';
import { AddFlow } from '@components/FlowManagment/AddFlow/AddFlowForm';
import StepList from '@components/StepManagment/StepList/StepList';
import { useActiveStep } from '@contexts/StepContext';
import { palette, theme } from '@theme';
import { permissionsMap } from '@constants/permissions';
import { hasPermission } from '@utils/helpers';
import { selectUserInfo } from '@store/auth/auth';

const animationStyles = (expanded: boolean) => ({
  maxWidth: expanded ? '100%' : 0,
  transition: 'max-width 0.2s ease-in-out',
  overflow: 'hidden',
  whiteSpace: 'nowrap'
});

const DEFAULT_SIDEBAR_WIDTH = 239;
const MIN_SIDEBAR_WIDTH = 70;

export interface MenuItem {
  icon: React.ReactElement;
  text: string;
  to: string;
  permission: string;
}

const pages = [
  {
    icon: <TimePastIcon color={theme.palette.primary.dark} />,
    text: 'Changes History',
    to: routes.underwriting.changeHistory,
    permission: permissionsMap.canViewChangeHistory
  }
];

const reportPages = [
  {
    icon: <DotIcon color={theme.palette.primary.dark} />,
    text: 'Lead Requests',
    to: routes.underwriting.leadRequest,
    permission: permissionsMap.canViewLeadRequestReport
  },
  {
    icon: <DotIcon color={theme.palette.primary.dark} />,
    text: 'Deniel Reasons',
    to: routes.underwriting.denialReasons,
    permission: permissionsMap.canViewDenialReasonReport
  }
];

const Sidebar = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { resetActive } = useActiveStep();
  const { startLoading, stopLoading } = useLoading();
  const { flowList, flowProduction } = useAppSelector(selectFlowList);
  const { flow } = useAppSelector(selectFlow);
  const user = useAppSelector(selectUserInfo);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);

  const [expanded, setExpanded] = useState(true);
  const [expandedFlow, setExpandedFlow] = useState<string | false>(false);
  const [expandedFlowList, setExpandedFlowList] = useState<boolean>(true);
  const [expandedReports, setExpandedReports] = useState(false);

  const handleReportsToggle = () => setExpandedReports((prev) => !prev);

  const handleExpandIconClick = (
    e: React.MouseEvent<SVGSVGElement>,
    flowItemId: string
  ) => {
    if (flowItemId === id) {
      e.preventDefault();
    }
  };

  const handleMouseDown = () => {
    setIsResizing(true);
    document.addEventListener('mouseup', handleMouseUp, true);
    document.addEventListener('mousemove', handleMouseMove, true);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    document.removeEventListener('mouseup', handleMouseUp, true);
    document.removeEventListener('mousemove', handleMouseMove, true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const newWidth = e.clientX - document.body.offsetLeft;
    if (newWidth > DEFAULT_SIDEBAR_WIDTH) {
      setSidebarWidth(newWidth);
    }
  }, []);

  const handleChangeFlow =
    (panel: string) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpandedFlow(newExpanded ? panel : false);
    };

  const toggleSidebar = useCallback(() => {
    setExpanded(!expanded);
    const width = expanded ? MIN_SIDEBAR_WIDTH : DEFAULT_SIDEBAR_WIDTH;
    setSidebarWidth(width);
  }, [expanded]);

  useEffect(() => {
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
    const fetchFlow = async (flowId: string) => {
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

    resetActive();
    if (id) {
      void fetchFlow(id);
    } else {
      dispatch(setInitialFlow());
    }
  }, [id]);

  return (
    <StyledPaper
      elevation={0}
      ref={sidebarRef}
      style={{
        width: sidebarWidth,
        transition: !isResizing ? 'width 0.2s ease-in-out' : ''
      }}
    >
      {expanded && <Resizer onMouseDown={handleMouseDown} />}
      <SidebarToggle
        fullWidth
        onClick={toggleSidebar}
        startIcon={
          <AngleLeftSquareIcon
            height={18}
            width={18}
            color={theme.palette.common.black}
          />
        }
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
      <List
        style={{ overflow: 'auto', height: 'calc(100% - 68px)' }}
        component="nav"
      >
        {expanded ? (
          <Accordion
            expanded={expandedFlowList}
            onChange={() => setExpandedFlowList(!expandedFlowList)}
            sx={{ marginBottom: '8px' }}
          >
            <StyledMainAccordionSummary
              expandIcon={<ExpandMoreIcon color="primary" />}
              aria-controls="flowList-content"
              id="flowList-header"
            >
              <ListItemIcon>
                <LineChartDotsIcon />
              </ListItemIcon>
              <Typography sx={animationStyles(expanded)}>Flow List</Typography>
            </StyledMainAccordionSummary>
            <StyledAccordionDetails>
              <Label variant="body2">Flow on Production</Label>
              <StyledAccordion
                expanded={
                  expandedFlow === PRODUCTION_FLOW_ID && expandedFlow === id
                }
                onChange={handleChangeFlow(PRODUCTION_FLOW_ID)}
              >
                <Box
                  sx={{
                    position: 'relative'
                  }}
                >
                  <StyledNavLink
                    to={`${routes.underwriting.flow.list}/${PRODUCTION_FLOW_ID}`}
                  >
                    <StyledSubAccordionSummary
                      expandIcon={<ExpandMoreIcon fontSize="small" />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <ListItemIcon>
                        <BezierIcon />
                      </ListItemIcon>
                      <Typography variant="body2">
                        {flowProduction?.name}
                      </Typography>
                    </StyledSubAccordionSummary>
                  </StyledNavLink>
                  <ListItemSecondaryAction>
                    <ActionsMenu isProductionFlow flow={flowProduction} />
                  </ListItemSecondaryAction>
                </Box>
                <StyledAccordionDetails>
                  <StepList nodes={flow.nodes} isProductionFlow />
                </StyledAccordionDetails>
              </StyledAccordion>
              <Label variant="body2">Draft Flows</Label>
              {flowList.map((flowItem) => (
                <StyledAccordion
                  key={flowItem.id}
                  expanded={expandedFlow === flowItem.id && expandedFlow === id}
                  onChange={handleChangeFlow(flowItem.id)}
                >
                  <Box
                    sx={{
                      position: 'relative'
                    }}
                  >
                    <StyledNavLink
                      to={`${routes.underwriting.flow.list}/${flowItem.id}`}
                    >
                      <StyledSubAccordionSummary
                        expandIcon={
                          <ExpandMoreIcon
                            sx={{
                              color: flowItem.id === id ? palette.primary : ''
                            }}
                            onClick={(e: React.MouseEvent<SVGSVGElement>) => {
                              handleExpandIconClick(e, flowItem.id);
                            }}
                            fontSize="medium"
                          />
                        }
                        aria-controls={`${flowItem.name}-content`}
                        id={flowItem.name}
                      >
                        <ListItemIcon>
                          <BezierIcon />
                        </ListItemIcon>
                        <Typography variant="body2">{flowItem.name}</Typography>
                      </StyledSubAccordionSummary>
                    </StyledNavLink>
                    <ListItemSecondaryAction>
                      <ActionsMenu flow={flowItem} />
                    </ListItemSecondaryAction>
                  </Box>
                  <StyledAccordionDetails>
                    <StepList nodes={flow.nodes} />
                  </StyledAccordionDetails>
                </StyledAccordion>
              ))}
              <AddFlow />
            </StyledAccordionDetails>
          </Accordion>
        ) : (
          <ListItemButton sx={{ height: '32px', marginBottom: '8px' }}>
            <ListItemIcon>
              <LineChartDotsIcon />
            </ListItemIcon>
          </ListItemButton>
        )}
        {pages.map((item, index) =>
          hasPermission(user?.policies, item) ? (
            <StyledListItemButton
              key={index}
              component={NavLink}
              to={item.to}
              sx={{ height: '32px', marginBottom: '8px' }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={animationStyles(expanded)}
              />
            </StyledListItemButton>
          ) : null
        )}
        {expanded ? (
          <StyledAccordion
            disableGutters
            expanded={expandedReports}
            onChange={handleReportsToggle}
          >
            <StyledMainAccordionSummary
              expandIcon={<ExpandMoreIcon color="primary" />}
              aria-controls="flowList-content"
              id="flowList-header"
            >
              <ListItemIcon>
                <DocumentPaperIcon />
              </ListItemIcon>
              <Typography sx={animationStyles(expanded)}>Reports</Typography>
            </StyledMainAccordionSummary>
            <StyledAccordionDetails>
              {reportPages.map((item, index) =>
                hasPermission(user?.policies, item) ? (
                  <ListItemButton
                    key={index}
                    component={NavLink}
                    to={item.to}
                    sx={{
                      height: '32px',
                      marginBottom: '8px',
                      marginLeft: '4px'
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2">{item.text}</Typography>
                      }
                      sx={animationStyles(expanded)}
                    />
                  </ListItemButton>
                ) : null
              )}
            </StyledAccordionDetails>
          </StyledAccordion>
        ) : (
          <ListItemButton sx={{ height: '32px', marginBottom: '8px' }}>
            <ListItemIcon>
              <DocumentPaperIcon />
            </ListItemIcon>
          </ListItemButton>
        )}
      </List>
    </StyledPaper>
  );
};

export default Sidebar;
