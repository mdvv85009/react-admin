import * as React from 'react';
import Loading from './loading.js';
import { styled } from '@mui/material/styles';
import { Typography } from '@material-ui/core';
import { Box, Paper } from '@mui/material';
import { Button, Tab, Tabs, Fab, TextField } from '@mui/material';
import {
  FormHelperText,
  Checkbox,
  Select,
  Input,
  MenuItem,
  Slide,
  RadioGroup,
  Radio,
  InputLabel,
  Chip,
  FormLabel,
  FormGroup,
  FormControl,
  FormControlLabel,
} from '@mui/material';
import {
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import { TabPanel, TabContext } from '@mui/lab';

import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import { useFetchGiftCodeData, useHttpRequest } from '../util/hook.js';
import { fromUnixTime, isPast } from 'date-fns';
import { timestampToDate, isPass } from '../util/time';

function FormItem(props) {
  const { number } = props;
  return (
    <Box display={'flex'} alignItems={'center'}>
      <Typography>獎勵{number}</Typography>
      <Box sx={{ m: 1, minWidth: 120 }}>
        <FormControl fullWidth size="small">
          <InputLabel id="demo-simple-select-label">物品種類</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="物品種類"
            value={`10`}
          >
            <MenuItem value={`10`} selected>
              Ten
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ m: 1, minWidth: 120 }}>
        <FormControl fullWidth size="small">
          <InputLabel id="demo-simple-select-label">物品</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="物品 ID"
            value={`20`}
          >
            <MenuItem value={`20`} selected>
              Twenty
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ m: 1, maxWidth: 120 }}>
        <FormControl>
          <TextField size="small" label="數量" />
        </FormControl>
      </Box>
    </Box>
  );
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function CreateGiftGroupDialog(props) {
  const { onClose, open, onSubmit } = props;
  const [itemArray, setItemArray] = React.useState([1]);
  const maxFieldAmount = 5;

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = () => {
    onSubmit();
  };

  const handleAppendItemArray = () => {
    setItemArray([...itemArray, itemArray.length + 1]);
  };

  const handleRemoveItemArray = () => {
    setItemArray([...itemArray.slice(0, itemArray.length - 1)]);
  };

  return (
    <Dialog open={open} maxWidth="lg" TransitionComponent={Transition}>
      <DialogTitle>建立兌換碼群組</DialogTitle>
      <DialogContent>
        <DialogContentText>新建兌換碼活動</DialogContentText>
        <FormControl sx={{ marginTop: 2 }}>
          <InputLabel htmlFor="description-input">描述</InputLabel>
          <Input
            id="description-input"
            aria-describedby="description-input-helper"
            fullWidth={true}
          />
          <FormHelperText id="description-input-helper" sx={{ marginLeft: 0 }}>
            做簡要備注用，方便查看，不會出現在遊戲裡。
          </FormHelperText>
        </FormControl>
        <Box
          sx={{ marginTop: 3 }}
          display={'flex'}
          justifyContent={'space-between'}
        >
          <Box sx={{ marginRight: 3 }}>
            <FormControl component="fieldset" variant="standard">
              <FormLabel component={'legend'}>選擇平台</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Erolabs"
                />
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Pinkcore"
                />
              </FormGroup>
            </FormControl>
          </Box>
          <Box display={'flex'} flexDirection={'column'}>
            <FormLabel component={'legend'}>選擇時間</FormLabel>
            <FormGroup>
              <FormControlLabel
                sx={{ m: 0, p: 0, marginTop: 0.5 }}
                control={<Input type="datetime-local" />}
                label="開始時間"
                labelPlacement="start"
              />
              <FormControlLabel
                sx={{ m: 0, p: 0, marginTop: 1.5 }}
                control={<Input type="datetime-local" />}
                label="結束時間"
                labelPlacement="start"
              />
            </FormGroup>
          </Box>
        </Box>
        <Box sx={{ marginTop: 3 }}>
          <FormLabel>選擇獎勵</FormLabel>
          <FormGroup sx={{ marginTop: 1 }}>
            {itemArray.map((value, index) => {
              return <FormItem key={index} number={value} />;
            })}
          </FormGroup>
        </Box>
        <Box sx={{ marginTop: 1 }}>
          {itemArray.length < maxFieldAmount && (
            <Fab
              sx={{ marginTop: 0 }}
              color="primary"
              aria-label="add"
              size="small"
              onClick={() => handleAppendItemArray()}
            >
              <AddIcon />
            </Fab>
          )}
          {itemArray.length > 1 && (
            <Fab
              sx={{ marginLeft: 2 }}
              color="error"
              aria-label="add"
              size="small"
              onClick={() => handleRemoveItemArray()}
            >
              <DeleteIcon />
            </Fab>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>取消</Button>
        <Button onClick={handleSubmit}>送出</Button>
      </DialogActions>
    </Dialog>
  );
}

function CreateGiftCodeDialog(props) {
  const { description = 'description', platforms = ['Erolabs', 'Pinkcore'] } =
    props;
  const { onClose, open, onSubmit, onPrevStep } = props;
  const [selected, setSelected] = React.useState('custom');
  const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
  }));

  const handlePrevStep = () => {
    onPrevStep();
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = () => {
    onSubmit();
  };

  const handleSelect = (event) => {
    setSelected(event.target.value);
  };

  return (
    <Dialog open={open} maxWidth="lg" TransitionComponent={Transition}>
      <DialogTitle>以建立活動：{description}</DialogTitle>
      <DialogContent>
        <FormLabel component={'legend'}>選擇平台</FormLabel>
        <Paper
          sx={{
            display: 'flex',
            listStyle: 'none',
            m: 0,
            p: 0,
          }}
          variant="outlined"
          component="ul"
        >
          {platforms.map((platform) => {
            return (
              <ListItem key={platform}>
                <Chip label={platform} />
              </ListItem>
            );
          })}
        </Paper>
        <Box
          sx={{ marginTop: 3 }}
          display={'flex'}
          justifyContent={'space-between'}
        >
          <Box sx={{ marginRight: 3 }}>
            <FormControl component="fieldset" variant="standard">
              <FormLabel component={'legend'}>兌換碼類別</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="normal"
                name="radio-buttons-group"
              >
                <FormControlLabel
                  value="normal"
                  control={<Radio />}
                  label="唯一"
                />
                <FormControlLabel
                  value="once"
                  control={<Radio />}
                  label="一次性"
                />
                <FormControlLabel
                  value="over"
                  control={<Radio />}
                  label="疊加"
                />
              </RadioGroup>
            </FormControl>
          </Box>
          <Box display={'flex'} flexDirection={'column'}>
            <FormLabel component={'legend'}>序號生成</FormLabel>
            <FormGroup>
              <FormControl size="small" sx={{ marginTop: 2 }}>
                <Select value={selected} onChange={handleSelect}>
                  <MenuItem value={'custom'} selected>
                    自定義
                  </MenuItem>
                  <MenuItem value={'random'}>隨機</MenuItem>
                </Select>
              </FormControl>
              <TextField
                sx={{ marginTop: 2 }}
                helperText={
                  selected === 'custom'
                    ? '輸入自訂兌換碼字串(12位)'
                    : '輸入指定數量兌換碼'
                }
                type={selected === 'custom' ? 'text' : 'number'}
                variant="standard"
              />
            </FormGroup>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ marginBottom: 1, justifyContent: 'space-between' }}>
        <Button sx={{ marginLeft: 2 }} onClick={handlePrevStep} variant="outlined">
          上一步
        </Button>
        <Box>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={handleSubmit}>送出</Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

function GiftListDialog(props) {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open} scroll="paper">
      <DialogTitle>兌換碼</DialogTitle>
      <DialogContent>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>GiftID</TableCell>
              <TableCell align="right">Code</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.giftList.map((gift) => (
              <TableRow key={gift.gift_id}>
                <TableCell>{gift.gift_id}</TableCell>
                <TableCell align="right">{gift.code}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}

function EditGiftDialog(props) {
  const { onClose, onSubmit, open, gift } = props;
  const [type, setType] = React.useState('editEndTime');
  const currentDate = new Date().toISOString().substring(0, 10);
  const currentTime = new Date().toISOString().substring(11, 16);
  const [selectedDate, setSelectedDate] = React.useState(currentDate);
  const [selectedTime, setSelectedTime] = React.useState(currentTime);
  const [codeAmount, setCodeAmount] = React.useState(1);
  const handleClose = () => {
    onClose();
  };
  const handleSubmit = () => {
    if (type === 'editEndTime') {
      let date = new Date(
        selectedDate.toString() + 'T' + selectedTime.toString()
      );
      let timestamp = date.getTime() / 1000;
      onSubmit(type, timestamp);
    } else if (type === 'createCodes') {
      onSubmit(type, codeAmount);
    }
  };
  const handleTabChange = (event, newValue) => {
    setType(newValue);
  };
  React.useEffect(() => {
    if (gift.type === 'normal') {
      setType('editEndTime');
    }
  }, [gift]);
  return (
    <Dialog open={open}>
      <DialogTitle>
        編輯兌換碼（目前開放 {gift.gift_list ? gift.gift_list.length : 0} 組）
      </DialogTitle>
      <DialogContent>
        <Box sx={{ marginBottom: 2 }} display={'flex'} flexDirection={'column'}>
          <Typography variant="body2">
            開始時間(UTC)：{fromUnixTime(gift.start_time).toLocaleString()}
          </Typography>
          <Typography variant="body2">
            結束時間(UTC)：{fromUnixTime(gift.end_time).toLocaleString()}
          </Typography>
        </Box>
        <TabContext value={type}>
          <Tabs value={type} onChange={handleTabChange}>
            <Tab value="editEndTime" label="更改結束時間" defaultChecked />
            {gift.type !== 'normal' && (
              <Tab value="createCodes" label="新增隨機兌換碼" />
            )}
          </Tabs>
          <TabPanel sx={{ padding: 0, paddingTop: 3 }} value="editEndTime">
            <>
              <TextField
                label="目標結束時間"
                type="date"
                sx={{ marginRight: 1 }}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                }}
                value={selectedDate}
              />
              <TextField
                label="目標結束時間"
                type="time"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => {
                  setSelectedTime(e.target.value);
                }}
                value={selectedTime}
              />
            </>
          </TabPanel>
          <TabPanel sx={{ padding: 0, paddingTop: 3 }} value="createCodes">
            <>
              <TextField
                type={'number'}
                InputLabelProps={{
                  shrink: true,
                }}
                value={codeAmount}
                label="輸入預增加兌換碼數量"
                fullWidth
                onChange={(e) => {
                  setCodeAmount(e.target.value);
                }}
              />
            </>
          </TabPanel>
        </TabContext>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>取消</Button>
        <Button onClick={handleSubmit}>送出</Button>
      </DialogActions>
    </Dialog>
  );
}

function Tables(props) {
  const {
    data,
    onClickRefresh,
    handleGiftListButtonClick,
    handleEditGiftListButtonClick,
  } = props;
  if (data) {
    return (
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell component="th" scope="row">
                群組 ID
              </TableCell>
              <TableCell align="right">平台</TableCell>
              <TableCell align="right">兌換碼類別</TableCell>
              <TableCell align="right">描述</TableCell>
              <TableCell align="right">開始時間</TableCell>
              <TableCell align="right">過期時間</TableCell>
              <TableCell align="center">序號</TableCell>
              <TableCell align="right">
                <IconButton onClick={onClickRefresh()}>
                  <RefreshIcon></RefreshIcon>
                </IconButton>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.result.map((row) => (
              <Row
                key={row.id}
                row={row}
                handleGiftListButtonClick={handleGiftListButtonClick(
                  row.gift_list
                )}
                handleEditGiftListButtonClick={handleEditGiftListButtonClick(
                  row
                )}
              />
            ))}
          </TableBody>
        </Table>
        {data.result.length === 0 && (
          <Typography variant="h4">這裡沒有任何資料</Typography>
        )}
      </TableContainer>
    );
  }
}

function Row(props) {
  const row = props.row;
  const [open, setOpen] = React.useState(false);
  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.id}
        </TableCell>
        <TableCell align="right">{row.platform}</TableCell>
        <TableCell align="right">{row.type}</TableCell>
        <TableCell align="right">Default Description</TableCell>
        <TableCell align="right">
          <Typography variant='body2'>{timestampToDate(row.start_time)}</Typography>
        </TableCell>
        <TableCell align="right">
          <Typography variant='body2'>{timestampToDate(row.end_time)}</Typography>
        </TableCell>
        <TableCell align="center">
          <Button
            variant="outlined"
            onClick={() => props.handleGiftListButtonClick(row.gift_list)}
          >
            序號
          </Button>
        </TableCell>
        <TableCell align="right">
          <Button
            variant="contained"
            onClick={() => props.handleEditGiftListButtonClick(row)}
          >
            編輯
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>RewardID</TableCell>
                    <TableCell align="right">ObjectType</TableCell>
                    <TableCell align="right">ObjectID</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.reward_list.map((reward) => (
                    <TableRow key={reward.reward_id}>
                      <TableCell>{reward.reward_id}</TableCell>
                      <TableCell align="right">{reward.object_type}</TableCell>
                      <TableCell align="right">{reward.object_id}</TableCell>
                      <TableCell align="right">{reward.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function GiftCode() {
  const { data, refreshData } = useFetchGiftCodeData();
  // const { isLoading, error, sendRequest } = useHttpRequest();
  const [isEditGiftDialogOpen, setEditGiftDialogOpen] = React.useState(false);
  const [isGiftListDialogOpen, setGiftListDialogOpen] = React.useState(false);
  const [isCreateGiftDialogOpen, setCreateGiftDialogOpen] =
    React.useState(false);
  const [isCreateCodeDialogOpen, setCreateCodeDialogOpen] =
    React.useState(false);
  const gift = React.useRef({});
  const giftList = React.useRef([]);

  const handleGiftListButtonClick = (gift_list) => {
    giftList.current = gift_list;
    setGiftListDialogOpen(true);
  };

  const handleEditGiftButtonClick = (arg) => {
    gift.current = arg;
    setEditGiftDialogOpen(true);
  };

  const handleCreateGiftButtonClick = () => {
    setCreateGiftDialogOpen(true);
  };

  const handleCreateGiftGroup = () => {
    setCreateGiftDialogOpen(false);
    setCreateCodeDialogOpen(true);
  };

  const handleCreatePrevStep = () => {
    setCreateCodeDialogOpen(false);
    setCreateGiftDialogOpen(true);
  };

  const handleCreateGiftCode = () => {
    setCreateCodeDialogOpen(false);
  };

  const handleRefresh = () => {
    refreshData();
  };

  const onEditDialogSubmit = (editType, arg) => {
    // todo: should post the modify submit
    setEditGiftDialogOpen(false);
  };

  return (
    <div className="gift_code">
      <Loading isLoading={data === undefined} />
      <Box textAlign={'right'}></Box>
      <>
        <Tables
          data={data}
          onClickRefresh={() => handleRefresh}
          handleGiftListButtonClick={() => handleGiftListButtonClick}
          handleEditGiftListButtonClick={() => handleEditGiftButtonClick}
        />
      </>
      {data !== undefined && (
        <Fab
          sx={{ marginTop: 2 }}
          color="primary"
          aria-label="add"
          onClick={() => handleCreateGiftButtonClick()}
        >
          <AddIcon />
        </Fab>
      )}
      <GiftListDialog
        open={isGiftListDialogOpen}
        onClose={() => setGiftListDialogOpen(false)}
        giftList={giftList.current}
      />
      <EditGiftDialog
        open={isEditGiftDialogOpen}
        onClose={() => setEditGiftDialogOpen(false)}
        onSubmit={(editType, arg) => onEditDialogSubmit(editType, arg)}
        gift={gift.current}
      />
      <CreateGiftGroupDialog
        open={isCreateGiftDialogOpen}
        onClose={() => setCreateGiftDialogOpen(false)}
        onSubmit={() => handleCreateGiftGroup()}
      />
      <CreateGiftCodeDialog
        open={isCreateCodeDialogOpen}
        onClose={() => setCreateCodeDialogOpen(false)}
        onPrevStep={() => handleCreatePrevStep()}
        onSubmit={() => handleCreateGiftCode()}
      />
    </div>
  );
}
