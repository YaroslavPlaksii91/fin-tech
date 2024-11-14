import { useState, useEffect } from 'react';
import ListItem from '@mui/material/ListItem';
import Tooltip from '@mui/material/Tooltip';
import { ApplicationModel } from '@eloanwarehouse/frontend-core';

import { StyledDrawer, StyledList, StyledListItemButton } from './styled';
import { applications } from './config';

import launcherImg from '@images/platforms/launcher.png';
import { LAUNCHER_URL } from '@constants/common';
import { authService } from '@services/auth';

const CrossPlatformDrawer: React.FC = () => {
  const [allowedApplications, setAllowedApplications] = useState<
    ApplicationModel[] | []
  >([]);

  const fetchAllowedApplications = async () => {
    try {
      const response = await authService.fetchAllowedApplications();
      setAllowedApplications(response.data as ApplicationModel[]);
    } catch (error) {
      //
    }
  };

  useEffect(() => {
    void fetchAllowedApplications();
  }, []);

  const handleRedirect = (platformURL: string) =>
    window.open(platformURL, '_self');

  return (
    <StyledDrawer variant="permanent" open={true}>
      <StyledList>
        <ListItem disablePadding>
          <Tooltip
            title="Application Launcher"
            followCursor
            placement="right-start"
          >
            <StyledListItemButton
              onClick={() => handleRedirect(LAUNCHER_URL)}
              className="launcher"
            >
              <img src={launcherImg} />
            </StyledListItemButton>
          </Tooltip>
        </ListItem>
        {!!allowedApplications?.length &&
          applications?.map((item) => {
            const application = allowedApplications?.find(
              (i) => i.name === item.key
            );
            if (!application) {
              return null;
            }
            const app = {
              ...application,
              ...item
            };

            return (
              <ListItem key={app.name} disablePadding>
                <Tooltip title={app.name} placement="right-start" followCursor>
                  <StyledListItemButton
                    onClick={() => handleRedirect(app.url)}
                    isSelected={app.url === window.location.origin + '/'}
                    className={app?.className}
                  >
                    <img src={app.iconSrc} />
                  </StyledListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
      </StyledList>
    </StyledDrawer>
  );
};

export default CrossPlatformDrawer;
