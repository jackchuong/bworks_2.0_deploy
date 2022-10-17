import * as React from 'react';
import {
    Avatar,
    Box,
    Button,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from '@mui/material';
import CustomerIcon from '@mui/icons-material/PersonAdd';
import { Link } from 'react-router-dom';
import { useTranslate, useGetList } from 'react-admin';
import { subDays } from 'date-fns';

import CardWithIcon from './CardWithIcon';
import { Customer } from '../types';

const NewMembers = () => {
    const translate = useTranslate();

    const aMonthAgo = subDays(new Date(), 30);
    aMonthAgo.setDate(aMonthAgo.getDate() - 30);
    aMonthAgo.setHours(0);
    aMonthAgo.setMinutes(0);
    aMonthAgo.setSeconds(0);
    aMonthAgo.setMilliseconds(0);

    const { isLoading, data: visitors } = useGetList<Customer>('members', {
        filter: {
            has_ordered: true,
            first_seen_gte: aMonthAgo.toISOString(),
        },
        sort: { field: 'first_seen', order: 'DESC' },
        pagination: { page: 1, perPage: 18 },
    });

    const nb = visitors ? visitors.reduce((nb: number) => ++nb, 0) : 0;
    return (
        <CardWithIcon
            to="/members"
            icon={CustomerIcon}
            title="New contributors"
            subtitle={nb}
        >
            <List sx={{ display: isLoading ? 'none' : 'block' }}>
                {visitors
                    ? visitors.map((record: Customer) => (
                          <ListItem
                              button
                              to={`/members/${record.id}`}
                              component={Link}
                              key={record.id}
                          >
                              <ListItemAvatar>
                                  <Avatar src={`${record.avatar}?size=32x32`} />
                              </ListItemAvatar>
                              <ListItemText
                                  primary={`${record.first_name} ${record.last_name}`}
                              />
                          </ListItem>
                      ))
                    : null}
            </List>
            <Box flexGrow={1}>&nbsp;</Box>
            <Button
                sx={{ borderRadius: 0 }}
                component={Link}
                to="/members"
                size="small"
                color="primary"
            >
                <Box p={1} sx={{ color: 'primary.main' }}>
                    {translate('pos.dashboard.all_customers')}
                </Box>
            </Button>
        </CardWithIcon>
    );
};

export default NewMembers;
