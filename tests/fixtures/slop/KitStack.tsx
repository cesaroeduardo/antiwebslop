import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

export function KitStack() {
  return (
    <Card>
      <CardHeader>
        <Badge>New</Badge>
        <CardTitle>Feature</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open</Button>
          </DialogTrigger>
          <DialogContent>Details</DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
